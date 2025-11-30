# Infrastructure Scripts

This directory contains scripts for provisioning Azure infrastructure for the Heartfledge CRM application.

## Prerequisites

- [Azure CLI](https://aka.ms/installazurecli) installed
- Azure subscription with appropriate permissions
- PowerShell 5.1+ or PowerShell Core 7+

## Scripts

### provision-postgresql.ps1

Provisions an Azure PostgreSQL Flexible Server with:
- Region validation against Azure Policy restrictions
- Secure password handling
- Automatic SKU fallback if the requested SKU is unavailable
- Comprehensive error handling and logging

#### Usage

```powershell
# Basic usage (will prompt for password)
.\provision-postgresql.ps1 `
    -ResourceGroupName "heartfledge-rg" `
    -ServerName "heartfledge-postgres" `
    -Location "eastus" `
    -AdminUser "pgadmin"

# With all parameters
.\provision-postgresql.ps1 `
    -ResourceGroupName "heartfledge-rg" `
    -ServerName "heartfledge-postgres" `
    -Location "eastus" `
    -AdminUser "pgadmin" `
    -AdminPassword (ConvertTo-SecureString "YourSecureP@ssword123" -AsPlainText -Force) `
    -Sku "Standard_B1ms" `
    -StorageSize 32 `
    -PostgresVersion "14"
```

#### Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| ResourceGroupName | Yes | - | Azure Resource Group name |
| ServerName | Yes | - | PostgreSQL server name |
| Location | Yes | - | Azure region (must be in allowed regions) |
| AdminUser | Yes | - | PostgreSQL admin username |
| AdminPassword | No | Prompted | SecureString password |
| Sku | No | Standard_B1ms | Server SKU |
| StorageSize | No | 32 | Storage in GB |
| PostgresVersion | No | 14 | PostgreSQL version |

#### SKU Fallback Order

If the requested SKU is unavailable, the script automatically tries:
1. Standard_B1ms (Burstable)
2. Standard_B2s (Burstable)
3. Standard_D2s_v3 (General Purpose)
4. Standard_D4s_v3 (General Purpose)

#### Region Validation

The script automatically:
1. Retrieves your Azure subscription ID
2. Checks for any region restriction policies (e.g., `sys.regionrestriction`)
3. Validates the requested location against allowed regions
4. Provides clear error messages if the region is not allowed

## Authentication

Before running any script, authenticate with Azure:

```bash
az login
```

Or for service principals:

```bash
az login --service-principal -u <client-id> -p <client-secret> --tenant <tenant-id>
```

## Troubleshooting

### "argument --admin-password/-p: expected one argument"

This error occurs when the password contains special characters that aren't properly escaped. The script handles this by:
- Using SecureString for password input
- Properly quoting the password when passed to Azure CLI

### "Creation with SKU failed"

The script automatically handles SKU failures by trying alternative SKUs. If all SKUs fail:
1. Check your subscription quotas
2. Try a different region
3. Contact Azure support for quota increases

### Region not allowed

If you get a region restriction error:
1. Check your organization's Azure Policy
2. Use one of the allowed regions listed in the error message
3. Contact your Azure administrator to add the region to allowed list
