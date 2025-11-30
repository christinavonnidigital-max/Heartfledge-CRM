<#
.SYNOPSIS
    Provisions an Azure PostgreSQL Flexible Server with proper error handling and region validation.

.DESCRIPTION
    This script creates an Azure PostgreSQL Flexible Server while:
    - Checking allowed regions from Azure Policy
    - Handling admin credentials securely
    - Implementing SKU fallback logic
    - Providing comprehensive error handling

.PARAMETER ResourceGroupName
    The name of the Azure Resource Group where the server will be created.

.PARAMETER ServerName
    The name for the PostgreSQL Flexible Server.

.PARAMETER Location
    The Azure region where the server will be created (must be in allowed regions).

.PARAMETER AdminUser
    The administrator username for the PostgreSQL server.

.PARAMETER AdminPassword
    The administrator password for the PostgreSQL server (will be prompted securely if not provided).

.PARAMETER Sku
    The SKU name for the server. Defaults to Standard_B1ms.

.PARAMETER StorageSize
    Storage size in GB. Defaults to 32.

.PARAMETER PostgresVersion
    PostgreSQL version. Defaults to 14.

.EXAMPLE
    .\provision-postgresql.ps1 -ResourceGroupName "myRG" -ServerName "myserver" -Location "eastus" -AdminUser "pgadmin"

.NOTES
    Requires Azure CLI to be installed and authenticated.
    Run 'az login' before executing this script.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ResourceGroupName,

    [Parameter(Mandatory = $true)]
    [string]$ServerName,

    [Parameter(Mandatory = $true)]
    [string]$Location,

    [Parameter(Mandatory = $true)]
    [string]$AdminUser,

    [Parameter(Mandatory = $false)]
    [SecureString]$AdminPassword,

    [Parameter(Mandatory = $false)]
    [string]$Sku = "Standard_B1ms",

    [Parameter(Mandatory = $false)]
    [int]$StorageSize = 32,

    [Parameter(Mandatory = $false)]
    [string]$PostgresVersion = "14"
)

# Enable strict mode for better error handling
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Define fallback SKUs in order of preference
$FallbackSkus = @(
    "Standard_B1ms",
    "Standard_B2s", 
    "Standard_D2s_v3",
    "Standard_D4s_v3"
)

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO"
    )
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "White" }
    }
    Write-Host "[$timestamp] [$Level] $Message" -ForegroundColor $color
}

function Test-AzureCliInstalled {
    try {
        $null = az --version 2>&1
        return $true
    }
    catch {
        return $false
    }
}

function Test-AzureAuthentication {
    try {
        $account = az account show 2>&1
        if ($LASTEXITCODE -ne 0) {
            return $false
        }
        return $true
    }
    catch {
        return $false
    }
}

function Get-SubscriptionId {
    $subscriptionId = az account show --query id -o tsv
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to retrieve subscription ID"
    }
    return $subscriptionId
}

function Get-AllowedRegions {
    param(
        [string]$SubscriptionId
    )
    
    Write-Log "Retrieving allowed regions from Azure Policy..."
    
    # Get policy assignments for the subscription
    $policyAssignments = az policy assignment list --scope "/subscriptions/$SubscriptionId" --query "[?contains(policyDefinitionId, 'regionrestriction') || contains(name, 'regionrestriction')].{Name:name,PolicyId:policyDefinitionId}" -o json 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-Log "No region restriction policy found. All regions are allowed." "WARN"
        return $null
    }
    
    $policies = $policyAssignments | ConvertFrom-Json
    
    if ($policies.Count -eq 0) {
        Write-Log "No region restriction policy found. All regions are allowed." "WARN"
        return $null
    }
    
    foreach ($policy in $policies) {
        Write-Log "Found policy: $($policy.Name)"
        
        # Try to get allowed locations from the policy assignment parameters
        $assignmentDetails = az policy assignment show --name $policy.Name --scope "/subscriptions/$SubscriptionId" --query "parameters.listOfAllowedLocations.value" -o json 2>&1
        
        if ($LASTEXITCODE -eq 0 -and $assignmentDetails -ne "null") {
            $allowedLocations = $assignmentDetails | ConvertFrom-Json
            if ($allowedLocations -and $allowedLocations.Count -gt 0) {
                Write-Log "Allowed regions: $($allowedLocations -join ', ')" "SUCCESS"
                return $allowedLocations
            }
        }
    }
    
    Write-Log "Could not determine allowed regions from policy. Proceeding without restriction." "WARN"
    return $null
}

function Test-RegionAllowed {
    param(
        [string]$Region,
        [array]$AllowedRegions
    )
    
    if ($null -eq $AllowedRegions -or $AllowedRegions.Count -eq 0) {
        return $true
    }
    
    return $AllowedRegions -contains $Region
}

function Get-SecurePasswordAsPlainText {
    param(
        [SecureString]$SecurePassword
    )
    
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePassword)
    try {
        return [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    }
    finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    }
}

function New-PostgreSQLFlexibleServer {
    param(
        [string]$ResourceGroup,
        [string]$Name,
        [string]$Region,
        [string]$Admin,
        [string]$Password,
        [string]$SkuName,
        [int]$Storage,
        [string]$Version
    )
    
    Write-Log "Attempting to create PostgreSQL Flexible Server with SKU: $SkuName"
    
    # Build the command with proper argument handling
    $result = az postgres flexible-server create `
        --resource-group $ResourceGroup `
        --name $Name `
        --location $Region `
        --admin-user $Admin `
        --admin-password "$Password" `
        --sku-name $SkuName `
        --tier "Burstable" `
        --storage-size $Storage `
        --version $Version `
        --output json 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        return @{
            Success = $true
            Result = $result | ConvertFrom-Json
        }
    }
    else {
        return @{
            Success = $false
            Error = $result
        }
    }
}

# Main execution
try {
    Write-Log "Starting Azure PostgreSQL Flexible Server provisioning..."
    Write-Log "================================================"
    
    # Check prerequisites
    if (-not (Test-AzureCliInstalled)) {
        throw "Azure CLI is not installed. Please install it from https://aka.ms/installazurecli"
    }
    Write-Log "Azure CLI is installed" "SUCCESS"
    
    if (-not (Test-AzureAuthentication)) {
        throw "Not authenticated to Azure. Please run 'az login' first."
    }
    Write-Log "Azure authentication verified" "SUCCESS"
    
    # Get subscription ID
    $subscriptionId = Get-SubscriptionId
    Write-Log "Using subscription: $subscriptionId"
    
    # Check allowed regions
    $allowedRegions = Get-AllowedRegions -SubscriptionId $subscriptionId
    
    if (-not (Test-RegionAllowed -Region $Location -AllowedRegions $allowedRegions)) {
        $allowedList = $allowedRegions -join ", "
        throw "Region '$Location' is not in the allowed regions list. Allowed regions: $allowedList"
    }
    Write-Log "Region '$Location' is allowed" "SUCCESS"
    
    # Handle admin password securely
    if ($null -eq $AdminPassword) {
        Write-Log "Prompting for admin password..." "WARN"
        $AdminPassword = Read-Host -Prompt "Enter admin password" -AsSecureString
    }
    
    # Convert SecureString to plain text for Azure CLI
    $plainPassword = Get-SecurePasswordAsPlainText -SecurePassword $AdminPassword
    
    # Validate password meets Azure requirements
    if ($plainPassword.Length -lt 8) {
        throw "Password must be at least 8 characters long"
    }
    
    # Ensure resource group exists
    Write-Log "Checking if resource group '$ResourceGroupName' exists..."
    $rgExists = az group exists --name $ResourceGroupName
    
    if ($rgExists -eq "false") {
        Write-Log "Creating resource group '$ResourceGroupName' in '$Location'..."
        az group create --name $ResourceGroupName --location $Location | Out-Null
        if ($LASTEXITCODE -ne 0) {
            throw "Failed to create resource group"
        }
        Write-Log "Resource group created" "SUCCESS"
    }
    else {
        Write-Log "Resource group already exists" "SUCCESS"
    }
    
    # Try to create server with fallback SKUs
    $skusToTry = @($Sku) + ($FallbackSkus | Where-Object { $_ -ne $Sku })
    $serverCreated = $false
    
    foreach ($currentSku in $skusToTry) {
        $result = New-PostgreSQLFlexibleServer `
            -ResourceGroup $ResourceGroupName `
            -Name $ServerName `
            -Region $Location `
            -Admin $AdminUser `
            -Password $plainPassword `
            -SkuName $currentSku `
            -Storage $StorageSize `
            -Version $PostgresVersion
        
        if ($result.Success) {
            Write-Log "PostgreSQL Flexible Server created successfully!" "SUCCESS"
            Write-Log "Server Name: $ServerName"
            Write-Log "SKU: $currentSku"
            Write-Log "Location: $Location"
            Write-Log "PostgreSQL Version: $PostgresVersion"
            $serverCreated = $true
            break
        }
        else {
            Write-Log "Failed with SKU '$currentSku': $($result.Error)" "WARN"
            Write-Log "Trying next SKU..." "WARN"
        }
    }
    
    if (-not $serverCreated) {
        throw "Failed to create PostgreSQL Flexible Server with any of the available SKUs"
    }
    
    # Clear sensitive data from memory
    $plainPassword = $null
    [System.GC]::Collect()
    
    Write-Log "================================================"
    Write-Log "Provisioning completed successfully!" "SUCCESS"
    Write-Log "Connection string: postgresql://${AdminUser}@${ServerName}.postgres.database.azure.com:5432/postgres?sslmode=require"
    
}
catch {
    Write-Log "Error: $_" "ERROR"
    Write-Log "Stack trace: $($_.ScriptStackTrace)" "ERROR"
    exit 1
}
