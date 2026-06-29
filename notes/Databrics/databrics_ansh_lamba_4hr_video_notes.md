# Azure Databricks Masterclass — Complete Revision Notes

> **Source:** [YouTube Masterclass (4 hrs)](https://www.youtube.com/watch?v=7pee6_Sq3VY)  
> **Stack covered:** Azure + Databricks + Apache Spark + Delta Lake

---

## Table of Contents

1. [What is Apache Spark & Spark Clusters](#1-what-is-apache-spark--spark-clusters)
2. [Spark Architecture](#2-spark-architecture)
3. [What is Databricks](#3-what-is-databricks)
4. [Account Setup — Azure + Databricks](#4-account-setup--azure--databricks)
5. [Azure Fundamentals for Databricks](#5-azure-fundamentals-for-databricks)
6. [Databricks Workspace Walkthrough](#6-databricks-workspace-walkthrough)
7. [Cluster Configuration](#7-cluster-configuration)
8. [Notebooks & Magic Commands](#8-notebooks--magic-commands)
9. [DataFrames — Basics](#9-dataframes--basics)
10. [DBFS — Databricks File System](#10-dbfs--databricks-file-system)
11. [Connecting Databricks to Azure Data Lake](#11-connecting-databricks-to-azure-data-lake)
12. [Databricks Utilities (dbutils)](#12-databricks-utilities-dbutils)
13. [Reading Data — Spark Reader API](#13-reading-data--spark-reader-api)
14. [PySpark Transformations](#14-pyspark-transformations)
15. [Delta Lake — Fundamentals](#15-delta-lake--fundamentals)
16. [Delta Tables — Managed vs External](#16-delta-tables--managed-vs-external)
17. [Delta Lake Functionalities (DML + Advanced)](#17-delta-lake-functionalities-dml--advanced)
18. [Delta Table Optimization Techniques](#18-delta-table-optimization-techniques)
19. [Incremental Loading with AutoLoader](#19-incremental-loading-with-autoloader)
20. [Databricks Workflows (Orchestration)](#20-databricks-workflows-orchestration)
21. [Interview Questions Summary](#21-interview-questions-summary)

---

## 1. What is Apache Spark & Spark Clusters

### The Core Idea

Imagine a computer lab with 30 PCs. If you connect all 30 PCs and treat them as **one single machine**, the combined processing power is enormous — and you can always add more labs (30 + 30 + 30 …). There is no upper limit to **horizontal scaling**.

- In Spark terminology, a single machine is called a **node**.
- A collection of connected nodes treated as one unit is called a **cluster**.

### Why Clusters?

When processing large data (e.g., 1 TB), instead of one machine doing all the work:

1. The data is split into subsets — called **data partitioning**.
2. Each node processes its partition **in parallel**.
3. Results are combined.

This is **parallel processing** — the core reason Spark clusters are used for big data.

```
1 TB of data
     │
 ┌───▼──────────────────────────┐
 │         Spark Cluster         │
 │  Node 1 │ Node 2 │ Node 3 …  │
 └──────────────────────────────┘
      ↓         ↓         ↓
  Process    Process    Process
  250 GB     250 GB     250 GB …
```

> **Key fact:** The founders of Databricks are the same team that created Apache Spark.

---

## 2. Spark Architecture

This is a **critical interview topic**. Understand it deeply.

### Components

| Component | Role |
|---|---|
| **Cluster Manager** | Manages the entire cluster; allocates resources |
| **Driver Program** | Orchestrates tasks; breaks your code into small tasks; does NOT process data |
| **Worker Nodes** | Actually execute the tasks (the hard work) |
| **Executors** | One executor per worker node in Databricks |

### Flow (Step-by-Step)

```
You (submit code)
       │
       ▼
Cluster Manager
       │
       ├──► Creates Driver Program (uses 1 node)
       │         │
       │         ├── Reads your code
       │         ├── Breaks processing into small tasks
       │         └── Tells Cluster Manager: "I need N worker nodes"
       │
       ├──► Creates Worker Node 1 (with Executor)
       ├──► Creates Worker Node 2 (with Executor)
       │
       ▼  (Cluster Manager's job is done)
Worker Nodes ◄──────────────► Driver Program
  (process data)          (gives instructions,
                           orchestrates flow)
       │
       ▼
  Results returned to Driver Program
```

**Key points to remember:**
- Driver Program = orchestrator, NOT an executor.
- Worker Nodes = do the actual data processing.
- Cluster Manager = resource allocator; exits the picture once workers are set up.
- Worker nodes communicate directly with the Driver Program (not through the manager).

---

## 3. What is Databricks

Databricks is a **managed layer on top of Spark clusters**. You don't need to set up, manage, or maintain clusters yourself — Databricks does it all.

- **Cloud-agnostic:** Works with Azure, AWS, and GCP.
- You only need to **configure** the cluster; Databricks handles provisioning and lifecycle.
- This is why every company is moving to Databricks for big data processing.

> **Why Azure in this course?** Azure requires more configuration steps (Service Principals, Key Vaults, Secret Scopes, ABFS paths) — exactly what interviewers test you on.

---

## 4. Account Setup — Azure + Databricks

### Step 1 — Create a Free Azure Account

1. Search **"Azure free account"** on Google → click the Microsoft link.
2. Click **"Try Azure for free"** (NOT "Pay as you go").
3. Fill in your details and provide credit card (for verification only — will NOT be charged after 30 days).
4. **What you get:** $200 USD credits valid for 30 days + 55 always-free services.

### Step 2 — Access Azure Portal

Go to: `portal.azure.com`

### Step 3 — Create a Resource Group

A **Resource Group** is simply a folder that holds your Azure services/resources.

1. Search "Resource Groups" in the portal → click **+ Create**.
2. Name it (e.g., `RG-DatabricksMasterClass`).
3. Choose any region → **Review + Create** → **Create**.

### Step 4 — Create Azure Data Lake Storage (ADLS Gen2)

> **Interview Tip:** By default, Azure creates Blob Storage. You must enable **Hierarchical Namespace** to convert it to a Data Lake.

1. In your Resource Group → **+ Create** → search **"Storage account"** → pick the Microsoft one.
2. Fill in a **globally unique** storage account name.
3. Pick region, **Standard** tier, **LRS** (Locally Redundant Storage) for redundancy.
4. ⚠️ Click **Next** (do not click Review + Create yet).
5. Under **Advanced** tab → check **"Enable hierarchical namespace"** → now it becomes a Data Lake (ADLS Gen2).
6. **Review + Create** → **Create**.

**Redundancy Options (for reference):**

| Option | Description |
|---|---|
| LRS | Locally Redundant — data replicated within same datacenter (cheapest) |
| ZRS | Zone Redundant — replicated across availability zones |
| GRS | Geo-Redundant — replicated to another region |
| GZRS | Geo-Zone Redundant — most expensive, highest availability |

### Step 5 — Create Containers in the Data Lake

Containers are top-level folders. Create two:

- `source` — where raw data lives (upload your CSV/Parquet files here)
- `destination` — where processed/transformed data is written

### Step 6 — Create Databricks Workspace

1. In your Resource Group → **+ Create** → search **"Azure Databricks"** → pick Microsoft's offering.
2. Name the workspace (e.g., `databricks-master`).
3. **Pricing tier:** Pick **Premium** (or **Trial Premium** if $200 is spent).
4. **Managed Resource Group:** Provide a name (e.g., `RG-Managed-DB-Master`) — this is for Databricks' internal use only. Do NOT touch it.
5. **Review + Create** → **Create** → once deployed, click **Launch Workspace**.

---

## 5. Azure Fundamentals for Databricks

### What is Hierarchical Namespace?

- **Blob Storage:** Data lives in containers only. No nested folders.
- **Data Lake (ADLS Gen2):** Supports hierarchical folders — `container/folder/subfolder/file.csv` — essential for big data workloads.

### Blob Storage vs Data Lake

| Feature | Blob Storage | ADLS Gen2 (Data Lake) |
|---|---|---|
| Folder-in-folder | ❌ | ✅ |
| Fine-grained ACLs | ❌ | ✅ |
| Optimized for analytics | ❌ | ✅ |
| Hierarchical namespace | ❌ | ✅ |

---

## 6. Databricks Workspace Walkthrough

### Left Navigation

| Tab | Purpose |
|---|---|
| **Workspace** | Create & organize notebooks, folders, dashboards |
| **Recent** | Quickly re-open recently used notebooks |
| **Catalog** | Browse all databases, tables, schemas (metadata) |
| **Workflows** | Orchestrate notebooks as pipelines/jobs |
| **Compute** | Create and manage clusters |
| **Data Engineering** | Connectors, ingestion tools |
| **Machine Learning** | Model building, experiments |
| **Marketplace** | Third-party connectors and data sets |
| **Partner Connect** | Connect to BI tools (Power BI, Tableau, Looker, etc.) |

### Creating a Workspace Folder

Navigate to **Workspace** → click on the dropdown → **Create** → **Folder** → give it a name.

Always organize notebooks inside folders.

---

## 7. Cluster Configuration

Go to **Compute** → **Create Compute**.

| Setting | Recommended Value (Learning) |
|---|---|
| Policy | Unrestricted |
| Mode | Single Node (Multi-Node in production) |
| Access Mode | Single User |
| Databricks Runtime | 14.3 LTS (Long Term Support) |
| Photon Acceleration | Not required for learning |
| Node Type | DS3 v2 (4 cores, 14 GB RAM) |
| Terminate after | 30 minutes of inactivity (saves cost) |

> **Tip:** In production, always use **Multi-Node** for actual big data workloads. **LTS** (Long Term Support) runtimes are the stable versions — prefer these.

---

## 8. Notebooks & Magic Commands

### Connecting a Notebook to a Cluster

Click the **Connect** button (top-right of notebook) → select your cluster.

### Default Language

The default language appears in the top-right of the notebook. Default is **Python**. You can change it via **File → Change Default Cell Language**.

### Magic Commands

Magic commands let you switch languages per cell without changing the global default.

| Command | Language/Action |
|---|---|
| `%python` | Run Python in this cell |
| `%sql` | Run SQL in this cell |
| `%scala` | Run Scala in this cell |
| `%r` | Run R in this cell |
| `%md` | Write Markdown (headings, bold, text) |
| `%fs` | Access DBFS (file system commands) |
| `%run` | Run another notebook from a path |

**Running a cell:** `Shift + Enter`

### Markdown Examples

```
%md
# Heading 1
## Heading 2
### Heading 3
**Bold Text**
```

### `%run` — Import Another Notebook

```python
%run /DataBricks-MasterClass/tutorial
```

This executes all code in the referenced notebook, making all its variables and configurations available in the current notebook. Extremely useful to avoid re-configuring service principals in every notebook.

---

## 9. DataFrames — Basics

### Creating a DataFrame from Custom Data

```python
# Step 1: Define data (list of tuples/rows)
my_data = [
    (1, "AA", 30),
    (2, "BB", 40),
    (3, "CC", 50)
]

# Step 2: Define schema (column names and types)
my_schema = "ID INT, Name STRING, Marks INT"

# Step 3: Create DataFrame
df = spark.createDataFrame(my_data, schema=my_schema)

# Step 4: Display
display(df)
# OR
df.display()
```

**`display()` vs `df.show()`:** `display()` is Databricks-specific and supports interactive visualizations (charts, graphs).

---

## 10. DBFS — Databricks File System

### What is DBFS?

DBFS (Databricks File System) is a **distributed file system** that acts as an **abstraction layer** on top of your cloud storage (Data Lake).

```
Your Notebook
     │
     ▼
  DBFS (Abstraction Layer)  ← file semantics like /FileStore/container/...
     │
     ▼
  Azure Data Lake (actual storage)
```

### Why DBFS?

Instead of writing full Azure URLs every time, you can use **file-system-like paths**:

```
# Without DBFS (full URL)
abfss://source@datalakeXYZ.dfs.core.windows.net/sales.csv

# With DBFS (file semantics)
/FileStore/source/sales.csv
```

> **Note:** DBFS is an abstraction — the actual data remains in Azure Data Lake. DBFS just provides a convenience layer.

### Mounting (Legacy)

In older Databricks setups, you would **mount** an external location to a DBFS path. This approach is being replaced by **Unity Catalog** in modern Databricks.

---

## 11. Connecting Databricks to Azure Data Lake

This is the most important section for interviews. It covers real-world cloud authentication.

### The Analogy

Think of Data Lake as a secured college. Databricks is a visitor trying to enter. The security guard (Azure) asks for an **ID card** before allowing access. That "ID card" is a **Service Principal**.

### Architecture Overview

```
Azure Key Vault
  └── Stores: app-secret (sensitive value)
         │
         ▼
Databricks Secret Scope  ←──── links to Key Vault (no hardcoding!)
         │
         ▼
Databricks Notebook
  └── Uses dbutils.secrets.get(scope, key)
         │
         ▼
Service Principal  ──────────────────► Azure Data Lake
  (has Storage Blob Data Contributor role)
```

### Step-by-Step Setup

#### Part 1 — Create a Service Principal (App Registration)

1. In Azure Portal → search **"Microsoft Entra ID"** (formerly Azure Active Directory).
2. Go to **App Registrations** → **New Registration**.
3. Name it (e.g., `service-principal-master`) → **Register**.
4. Copy and save:
   - **Application (client) ID** → your `app_id`
   - **Directory (tenant) ID** → your `tenant_id`
5. Go to **Certificates & Secrets** → **New Client Secret**.
6. Add description, set expiry → **Add**.
7. ⚠️ **Immediately copy the secret Value** — it disappears after you navigate away.

#### Part 2 — Assign Data Lake Access to the Service Principal

1. Go to your **Storage Account** → **Containers** → **Source container**.
2. Click **Access Control (IAM)** → **+ Add** → **Add Role Assignment**.
3. Search for: **"Storage Blob Data Contributor"** → **Next**.
4. Click **+ Select Members** → search your service principal name → select it.
5. **Review + Assign** → **Assign**.

#### Part 3 — Configure Databricks Notebook to Use the Credentials

Use the code from [Microsoft Docs — Access Azure Data Lake from Databricks](https://docs.microsoft.com/en-us/azure/databricks/):

```python
# Service Principal Configuration
storage_account_name = "datalakeXYZ"
app_id     = "your-application-id"
tenant_id  = "your-tenant-id"
secret     = "your-client-secret-value"   # ← will be replaced by dbutils.secrets later

spark.conf.set(f"fs.azure.account.auth.type.{storage_account_name}.dfs.core.windows.net", "OAuth")
spark.conf.set(f"fs.azure.account.oauth.provider.type.{storage_account_name}.dfs.core.windows.net",
               "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider")
spark.conf.set(f"fs.azure.account.oauth2.client.id.{storage_account_name}.dfs.core.windows.net", app_id)
spark.conf.set(f"fs.azure.account.oauth2.client.secret.{storage_account_name}.dfs.core.windows.net", secret)
spark.conf.set(f"fs.azure.account.oauth2.client.endpoint.{storage_account_name}.dfs.core.windows.net",
               f"https://login.microsoftonline.com/{tenant_id}/oauth2/token")
```

---

## 12. Databricks Utilities (dbutils)

`dbutils` is a collection of helper utilities built into Databricks notebooks.

---

### 12.1 `dbutils.fs` — File System Utility

**Purpose:** List files/folders at a given path. Also used to verify that your connection to Data Lake is working.

```python
# List files in a container
dbutils.fs.ls("abfss://source@datalakeXYZ.dfs.core.windows.net/")
```

**ABFS URL format:**
```
abfss://<container-name>@<storage-account-name>.dfs.core.windows.net/<path>
```

---

### 12.2 `dbutils.widgets` — Parameterized Notebooks

**Purpose:** Create UI input parameters so notebooks can accept dynamic values at runtime.

```python
# Create a text input widget with a default value
dbutils.widgets.text("p_name", "default_value")

# Read the widget value
v = dbutils.widgets.get("p_name")
print(v)  # prints whatever the user entered, or "default_value"
```

**Interview Question:** *How do you make a Databricks notebook parameterized?*  
**Answer:** Use `dbutils.widgets`.

---

### 12.3 `dbutils.secrets` — Secrets Management (⭐ Advanced & Important)

**Purpose:** Retrieve sensitive credentials (passwords, secrets, connection strings) securely — without hardcoding them in the notebook.

#### Full Setup Flow

**1. Create Azure Key Vault**

- Azure Portal → search "Key Vault" → **Create**.
- Choose your Resource Group.
- Under **Access Policy**, select: **Vault Access Policy** (NOT Azure RBAC).
- Review + Create.

**2. Assign yourself as Key Vault Administrator**

- In Key Vault → **Access Control (IAM)** → **+ Add Role Assignment**.
- Role: **Key Vault Administrator** → assign to your email.

**3. Create a Secret in Key Vault**

- Key Vault → **Secrets** → **Generate/Import**.
- Name: `app-secret` | Value: your service principal secret.

**4. Create a Databricks Secret Scope**

Go to your Databricks workspace URL and append:
```
#secrets/createScope
```
Example: `https://adb-xxxx.azuredatabricks.net/#secrets/createScope`

- **Scope Name:** e.g., `unch-scope`
- **Manage Principal:** All Workspace Users
- **DNS Name:** Copy from Key Vault → Properties → **Vault URI**
- **Resource ID:** Copy from Key Vault → Properties → **Resource ID**
- Click **Create**.

**5. Use Secrets in Notebook**

```python
# List all secret keys in a scope
dbutils.secrets.list(scope="unch-scope")

# Get a secret value
secret = dbutils.secrets.get(scope="unch-scope", key="app-secret")
# Output: [REDACTED]  ← value is hidden but usable in code
```

Now replace the hardcoded secret in your spark configuration:

```python
secret = dbutils.secrets.get(scope="unch-scope", key="app-secret")
spark.conf.set(f"fs.azure.account.oauth2.client.secret.{storage_account_name}...", secret)
```

> **Why `[REDACTED]`?** Databricks never displays secret values in output — it shows `[REDACTED]` to prevent exposure. The value IS being used internally.

---

## 13. Reading Data — Spark Reader API

### Reading CSV

```python
df_sales = spark.read \
    .format("csv") \
    .option("header", True) \
    .option("inferSchema", True) \
    .load("abfss://source@datalakeXYZ.dfs.core.windows.net/")

display(df_sales)
```

### Key Options Explained

| Option | Description |
|---|---|
| `header=True` | Treat first row as column names |
| `inferSchema=True` | Spark auto-detects column data types by sampling the data |
| `format("csv")` | File format; can be `json`, `parquet`, `delta`, `orc`, etc. |

### Supported File Formats

```python
spark.read.format("csv")      # CSV
spark.read.format("json")     # JSON
spark.read.format("parquet")  # Parquet (columnar, efficient)
spark.read.format("delta")    # Delta
spark.read.format("orc")      # ORC (columnar)
```

---

## 14. PySpark Transformations

First, import required libraries:

```python
from pyspark.sql import functions as F
from pyspark.sql.types import *
```

### Transformation 1 — Split (String → Array)

Split a string column by a delimiter and store as array:

```python
df_result = df_sales.withColumn(
    "item_type",                      # column to transform (same name = overwrite)
    F.split(F.col("item_type"), " ")  # split by space delimiter
)
df_result.display()
```

### Transformation 2 — Add Literal Column

Add a constant value (flag) to every row, potentially from a widget variable:

```python
v = dbutils.widgets.get("p_name")   # dynamic value from widget

df_result = df_sales.withColumn(
    "flag",    # new column name
    F.lit(v)   # F.lit() creates a constant/literal value
)
df_result.display()
```

### Transformation 3 — Type Casting

Change the data type of a column:

```python
from pyspark.sql.types import StringType

df_result = df_sales.withColumn(
    "item_visibility",
    F.col("item_visibility").cast(StringType())
)
df_result.display()
```

### `withColumn()` Summary

```python
# Overwrite existing column
df.withColumn("col_name", transformation)

# Add new column
df.withColumn("new_col_name", transformation)
```

---

## 15. Delta Lake — Fundamentals

### What is Delta Lake?

Delta Lake is **not a different file format** in the traditional sense. Underneath, data is still stored as **Parquet files**. What makes it "Delta" is the addition of a **transaction log (Delta Log)** alongside those Parquet files.

```
destination/
  └── sales/
        ├── part-00001.parquet     ← actual data
        ├── part-00002.parquet
        └── _delta_log/
              ├── 00000000000000000000.json   ← version 0: table creation
              ├── 00000000000000000001.json   ← version 1: insert
              ├── 00000000000000000002.json   ← version 2: insert
              └── ...
```

### Why Delta Log is Powerful

**Problem with plain Parquet:**  
If you have 1,000 Parquet files, to read metadata (schema, column types), Spark must open each file individually. At scale, this is extremely slow.

**Solution with Delta Log:**  
All metadata (schema, column names, data types, statistics) is centralized in the `_delta_log` JSON files. Spark reads the log first, then reads only the required Parquet files.

### Writing Data in Delta Format

```python
df_sales.write \
    .format("delta") \
    .mode("append") \          # see modes below
    .option("path", "abfss://destination@datalakeXYZ.dfs.core.windows.net/sales") \
    .save()
```

### Write Modes

| Mode | Behavior |
|---|---|
| `append` | Adds new data; existing data untouched |
| `overwrite` | Deletes existing data; writes fresh data |
| `error` | Throws error if data already exists |
| `ignore` | Silently skips writing if data exists; no error |

---

## 16. Delta Tables — Managed vs External

### Managed Delta Tables

| Aspect | Detail |
|---|---|
| Metadata | Stored in Metastore (Hive/Unity) |
| Actual data | Stored in Databricks' **default** storage account (you don't control it) |
| On `DROP TABLE` | **Both** metadata AND data are deleted |

```sql
-- Create a database first
CREATE DATABASE sales_db;

-- Create a managed table
CREATE TABLE sales_db.managed_table (
    ID INT,
    Name STRING,
    Marks INT
)
USING DELTA;

-- Insert data
INSERT INTO sales_db.managed_table VALUES (1, 'AA', 30), (2, 'BB', 40);

-- Query
SELECT * FROM sales_db.managed_table;

-- DROP removes data too!
DROP TABLE sales_db.managed_table;
```

---

### External Delta Tables

| Aspect | Detail |
|---|---|
| Metadata | Stored in Metastore |
| Actual data | Stored in **your own** storage account (you control it) |
| On `DROP TABLE` | Only metadata is removed; **data remains** in storage |

```sql
-- Create an external table with LOCATION
CREATE TABLE sales_db.external_table (
    ID INT,
    Name STRING,
    Marks INT
)
USING DELTA
LOCATION 'abfss://destination@datalakeXYZ.dfs.core.windows.net/sales_db/external_table';

-- Insert data
INSERT INTO sales_db.external_table VALUES (1, 'AA', 30), (2, 'BB', 40);

-- Query
SELECT * FROM sales_db.external_table;

-- DROP only removes metadata; data still exists in the Data Lake!
DROP TABLE sales_db.external_table;
```

> **Interview Tip:** In organizations, **external tables are preferred** because you don't want Databricks accidentally deleting your production data when dropping a table.

---

## 17. Delta Lake Functionalities (DML + Advanced)

### 17.1 INSERT

```sql
INSERT INTO sales_db.external_table VALUES (5, 'EE', 54), (6, 'FF', 60);
```

Behind the scenes: A **new Parquet file** is added. A new JSON entry is added to `_delta_log` with `"add"` operation.

---

### 17.2 DELETE & Tombstoning

```sql
DELETE FROM sales_db.external_table WHERE ID = 8;
```

**What really happens (Tombstoning):**

1. Databricks does NOT delete data from the existing Parquet file.
2. It reads the affected Parquet file, filters out the deleted row.
3. Writes a **new Parquet file** with the remaining rows.
4. In `_delta_log`, it marks the old Parquet files as **`remove`** (tombstoned) and the new file as **`add`**.

```
Before DELETE:
  part-0001.parquet  → [1, AA, 30], [2, BB, 40]  ← still exists (tombstoned)
  part-0002.parquet  → [5, EE, 54], [6, FF, 60], [7, GG, 70], [8, HH, 80]  ← tombstoned

After DELETE (ID=8):
  part-0001.parquet  → (tombstoned)
  part-0002.parquet  → (tombstoned)
  part-0003.parquet  → [1,AA,30], [2,BB,40], [5,EE,54], [6,FF,60], [7,GG,70]  ← new
```

**Why soft-delete?** To enable **time travel** — you can roll back to a version before the delete.

---

### 17.3 Data Versioning & History

```sql
DESCRIBE HISTORY sales_db.external_table;
```

Output shows all versions with:
- Version number
- Timestamp
- Operation (CREATE TABLE, WRITE, DELETE, OPTIMIZE, RESTORE, etc.)
- User who performed it

---

### 17.4 Time Travel ⏱️

Go back to any previous version of a Delta table:

```sql
-- Restore to a specific version number
RESTORE TABLE sales_db.external_table TO VERSION AS OF 2;

-- Restore to a specific timestamp
RESTORE TABLE sales_db.external_table TO TIMESTAMP AS OF '2024-01-15T00:00:00';
```

Use cases:
- Accidentally deleted data → restore to previous version.
- Compliance/audit requirements.
- Debugging — compare current vs historical state.

---

### 17.5 VACUUM — Physical File Deletion

**Default behavior:** Tombstoned Parquet files are kept for **7 days** (to support time travel).

```sql
-- Run vacuum with default retention (7 days — won't delete recent files)
VACUUM sales_db.external_table;

-- Delete files older than 30 days
VACUUM sales_db.external_table RETAIN 30 HOURS;   -- or RETAIN 720 HOURS for 30 days

-- Force delete all tombstoned files immediately (⚠️ use with caution)
VACUUM sales_db.external_table RETAIN 0 HOURS;
```

> ⚠️ **Warning:** After running VACUUM, you lose the ability to time-travel to versions before the vacuumed point. Only use in production when necessary (e.g., GDPR data deletion requests).

---

## 18. Delta Table Optimization Techniques

### 18.1 OPTIMIZE

**Problem:** Over time, many small Parquet files accumulate (from many small inserts/appends). Reading from many small files is inefficient.

**Solution:** `OPTIMIZE` merges small Parquet files into fewer, larger files.

**Principle:** *It is always better to read from fewer, larger partitions than many small ones.*

```sql
OPTIMIZE sales_db.external_table;
```

**Effect:** Compacts many small files into larger ones → fewer I/O operations → faster reads.

---

### 18.2 Z-ORDER BY

Z-ORDER is an **indexing technique** applied on top of OPTIMIZE. It:
1. Compacts files (like OPTIMIZE).
2. **Sorts data** within each file based on the specified column.
3. Enables **Data Skipping** — skip entire files when querying by the Z-ordered column.

```sql
OPTIMIZE sales_db.external_table ZORDER BY (ID);
```

**Why Z-ORDER by the filter column?**  
If you frequently query `WHERE ID = 3`, and data is sorted by ID, Spark knows:
- Partition 1 has IDs 1–4
- Partition 2 has IDs 5–8

So it **skips Partition 2 entirely** — no need to scan it.

This is called **Data Skipping**.

**Analogy:** Like a book index — you don't read every page to find "photosynthesis", you go directly to page 147.

```
Before Z-ORDER:                  After Z-ORDER:
  Part1: [3,7,1,8]                Part1: [1,2,3,4]   ← sorted
  Part2: [5,2,4,6]                Part2: [5,6,7,8]   ← sorted
  Part3: [...]                    (fewer, bigger files)
  Part4: [...]
```

---

### Optimization Summary

| Command | What it does | Impact |
|---|---|---|
| `OPTIMIZE` | Compacts small files into larger ones | Fewer I/O operations |
| `ZORDER BY` | Compacts + sorts data by column | Data skipping on filter queries |
| `VACUUM` | Physically deletes tombstoned files | Reduces storage cost |

---

## 19. Incremental Loading with AutoLoader

### The Problem

In naive pipelines, every run re-reads ALL files from source — even those already processed. This wastes compute and time.

### What is AutoLoader?

AutoLoader is a **streaming-based incremental ingestion framework** in Databricks that:
- Monitors a cloud storage location for **new files only**.
- Processes only the new files (not previously-seen files).
- Maintains its state via a **checkpoint**.

### Streaming DataFrame vs Standard DataFrame

| | Standard DataFrame | Streaming DataFrame |
|---|---|---|
| Data | Bounded (fixed snapshot) | Unbounded (continuous stream) |
| Read method | `spark.read` | `spark.readStream` |
| Write method | `df.write` | `df.writeStream` |
| Format | Any | `cloudFiles` (for AutoLoader) |

### AutoLoader Code

```python
# Step 1: Create a Streaming DataFrame (Reading side)
df_stream = spark.readStream \
    .format("cloudFiles") \          # AutoLoader uses cloudFiles format
    .option("cloudFiles.format", "parquet") \   # actual file format of source files
    .option("cloudFiles.schemaLocation", "abfss://al-destination@datalakeXYZ.dfs.core.windows.net/checkpoint") \
    .load("abfss://al-source@datalakeXYZ.dfs.core.windows.net/")

# Step 2: Write the stream to destination (Writing side)
df_stream.writeStream \
    .format("delta") \
    .option("checkpointLocation", "abfss://al-destination@datalakeXYZ.dfs.core.windows.net/checkpoint") \
    .trigger(processingTime="5 seconds") \    # how often to check for new files
    .start("abfss://al-destination@datalakeXYZ.dfs.core.windows.net/data")
```

### Key Concepts

| Concept | Purpose |
|---|---|
| `cloudFiles.schemaLocation` | Where AutoLoader stores inferred schema of incoming files |
| `checkpointLocation` | Where AutoLoader saves its state — which files have been processed |
| `trigger(processingTime=...)` | How frequently to check for new files (default: ~0.5ms) |
| Schema Location | Read by the write stream to know the structure of incoming data |
| Checkpoint Location | Prevents reprocessing already-ingested files |

### How Checkpointing Works

```
Source Container:          Checkpoint:              Destination:
  file_1.parquet  ──────►  "file_1 processed"  ──►  data/
  file_2.parquet  ──────►  "file_2 processed"  ──►  data/
  file_3.parquet  ──────►  (not yet)           (not processed yet)
```

Next run picks up only `file_3.parquet`.

> **Always stop the stream** when done testing: click the **Interrupt** button in the notebook or call `query.stop()`. Running streams consume cluster resources continuously.

---

## 20. Databricks Workflows (Orchestration)

### What are Workflows?

Workflows let you **orchestrate multiple notebooks** (or scripts) as a sequential or parallel **pipeline/job** — without writing any scheduler code.

Think of it as a lightweight version of Azure Data Factory or Apache Airflow, built into Databricks.

### Creating a Workflow Job

1. Go to **Workflows** in the left nav → **Create Job**.
2. **Name your first task** (e.g., `run_notebook_1`).
3. **Type:** Notebook → browse and select your notebook.
4. **Cluster:** Pick your existing cluster.
5. **Parameters:** (optional) pass key-value pairs to the notebook's widgets.
6. **Retries:** Set how many times to retry on failure.
7. Click anywhere on canvas → **Save and Continue**.

**Adding a second task (sequential):**
1. Click **+ Add Task** → Notebook.
2. Configure Notebook 2.
3. Set **"Depends on"** to the first task — this enforces sequential execution.

### Workflow Features

| Feature | Description |
|---|---|
| **Schedule** | Run at a specific time (cron-based) |
| **Trigger** | Event-based or file-arrival trigger |
| **Parameters** | Pass dynamic values to notebooks |
| **Notifications** | Email alerts on success/failure |
| **Retries** | Auto-retry failed tasks N times |
| **Job Lineage** | View dependencies between tasks |
| **Run History** | Full audit trail of all job runs |

### Monitoring a Run

After clicking **Run Now**, click **View Run** to see:
- Real-time task status (running/succeeded/failed).
- Task output logs.
- Start/end timestamps.
- Job ID and Run ID.
- Notebook output for each task.

---

## 21. Interview Questions Summary

Here are key interview questions covered throughout the course:

**Spark & Architecture:**
- What is a Spark cluster?
- What is the role of the Driver Program vs Worker Nodes?
- What is the Cluster Manager's responsibility?
- What is parallel processing / data partitioning?

**Azure & Storage:**
- What is the difference between Azure Blob Storage and Azure Data Lake Gen2?
- How do you enable hierarchical namespace when creating a storage account?
- What are the 4 redundancy options in Azure storage? (LRS, ZRS, GRS, GZRS)
- What is a Resource Group?

**Authentication:**
- How does Databricks access data in Azure Data Lake?
- What is a Service Principal?
- What is Azure Key Vault and why use it?
- What is a Databricks Secret Scope?
- Why should you never hardcode secrets in notebooks?

**Databricks:**
- What is DBFS?
- What is `%run` magic command?
- How do you parameterize a notebook? (`dbutils.widgets`)
- What are the 4 write modes in Spark?

**Delta Lake:**
- What is Delta Lake? Is it a file format?
- What is the Delta Log / Transaction Log?
- What is Tombstoning?
- What is time travel in Delta Lake?
- What is the difference between Managed and External Delta tables?
- What happens to data when you `DROP` a managed vs external table?
- What is the `VACUUM` command? What is its default retention period?
- What is the purpose of `OPTIMIZE`?
- What is Z-ORDER BY and what is Data Skipping?

**AutoLoader:**
- What is AutoLoader?
- What is a Streaming DataFrame?
- What is a checkpoint in AutoLoader?
- How is AutoLoader different from a standard batch read?

---

## Quick Reference: Key Code Snippets

```python
# Read CSV from Data Lake
df = spark.read.format("csv").option("header", True).option("inferSchema", True) \
    .load("abfss://source@account.dfs.core.windows.net/")

# Write as Delta
df.write.format("delta").mode("overwrite") \
    .option("path", "abfss://destination@account.dfs.core.windows.net/sales") \
    .save()

# Create external Delta table
# %sql
# CREATE TABLE db.ext_table (ID INT, Name STRING) USING DELTA
# LOCATION 'abfss://...'

# Time travel
# RESTORE TABLE db.ext_table TO VERSION AS OF 2;
# SELECT * FROM db.ext_table VERSION AS OF 2;

# Optimize + ZOrder
# OPTIMIZE db.ext_table ZORDER BY (ID);

# Vacuum
# VACUUM db.ext_table RETAIN 0 HOURS;

# AutoLoader (streaming)
df_stream = spark.readStream.format("cloudFiles") \
    .option("cloudFiles.format", "parquet") \
    .option("cloudFiles.schemaLocation", "abfss://dest@account.dfs.core.windows.net/ckpt") \
    .load("abfss://source@account.dfs.core.windows.net/")

df_stream.writeStream.format("delta") \
    .option("checkpointLocation", "abfss://dest@account.dfs.core.windows.net/ckpt") \
    .trigger(processingTime="10 seconds") \
    .start("abfss://dest@account.dfs.core.windows.net/data")

# Secrets
secret = dbutils.secrets.get(scope="my-scope", key="app-secret")

# List files
dbutils.fs.ls("abfss://source@account.dfs.core.windows.net/")

# Run another notebook
# %run /WorkspaceName/NotebookName
```

---

*Notes compiled from the full 4-hour Azure Databricks Masterclass video.*