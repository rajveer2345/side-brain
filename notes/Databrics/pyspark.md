# ⚡ PySpark Mastery Notes
### A Complete Reference for Databricks Learners

> **How to use this sheet:** Read top-to-bottom once. Then use the section headers to jump-revisit specific topics. Interview questions are at the end — treat each as a mini self-test.

---

## Table of Contents

1. [What is PySpark?](#1-what-is-pyspark)
2. [The Big Picture: How Spark Works](#2-the-big-picture-how-spark-works)
3. [Core Concepts](#3-core-concepts)
   - RDD
   - DataFrame
   - Dataset
4. [SparkSession — Your Entry Point](#4-sparksession--your-entry-point)
5. [Reading & Writing Data](#5-reading--writing-data)
6. [DataFrame Operations](#6-dataframe-operations)
7. [Transformations vs Actions](#7-transformations-vs-actions)
8. [Working with Columns](#8-working-with-columns)
9. [Filtering & Selecting Data](#9-filtering--selecting-data)
10. [Aggregations & GroupBy](#10-aggregations--groupby)
11. [Joins](#11-joins)
12. [Window Functions](#12-window-functions)
13. [User Defined Functions (UDFs)](#13-user-defined-functions-udfs)
14. [Handling Null Values](#14-handling-null-values)
15. [Schema Management](#15-schema-management)
16. [Partitioning & Performance](#16-partitioning--performance)
17. [Caching & Persistence](#17-caching--persistence)
18. [Spark SQL](#18-spark-sql)
19. [PySpark with Delta Lake (Databricks)](#19-pyspark-with-delta-lake-databricks)
20. [Common Debugging & Optimization Tips](#20-common-debugging--optimization-tips)
21. [Interview Questions](#21-interview-questions)

---

## 1. What is PySpark?

**PySpark** is the Python API for **Apache Spark** — a distributed computing framework designed to process massive datasets (GBs to TBs) in parallel across a cluster of machines.

| Tool | Best For |
|---|---|
| pandas | Small-to-medium data (fits in RAM on one machine) |
| PySpark | Big data (doesn't fit in RAM, needs distributed processing) |

**Why Databricks uses PySpark:**
Databricks is a cloud platform built on top of Apache Spark. When you write PySpark code in a Databricks notebook, it runs on a managed Spark cluster — you get distributed compute without setting anything up manually.

---

## 2. The Big Picture: How Spark Works

```
Your PySpark Code
       ↓
   Driver Program  ← (orchestrator, runs on one node)
       ↓
   Cluster Manager  ← (YARN / Kubernetes / Databricks)
       ↓
  Worker Nodes (Executors)
  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │  Executor  │  │  Executor  │  │  Executor  │
  │ [Task][Task]│  │ [Task][Task]│  │ [Task][Task]│
  └────────────┘  └────────────┘  └────────────┘
```

### Key Terms

| Term | What It Means |
|---|---|
| **Driver** | The main program. Builds the execution plan and coordinates workers. |
| **Executor** | A JVM process on a worker node that actually runs tasks. |
| **Task** | The smallest unit of work. One task = one partition of data. |
| **Job** | Triggered by an action (e.g., `.count()`). Made up of stages. |
| **Stage** | A group of tasks that can run without a shuffle. |
| **Shuffle** | Redistributing data across partitions (expensive — triggers a new stage). |
| **DAG** | Directed Acyclic Graph — Spark's internal execution plan, built lazily. |

### The Lazy Evaluation Model

Spark **does not execute immediately** when you call a transformation. It builds a DAG of what needs to happen. Execution only triggers when you call an **action**.

```python
df = spark.read.csv("data.csv")     # No execution yet
df2 = df.filter(df.age > 30)        # No execution yet — just plans it
df2.count()                          # ← ACTION! Now Spark executes the full plan.
```

This is like writing a query plan before actually running a SQL query.

---

## 3. Core Concepts

### 3.1 RDD (Resilient Distributed Dataset)

The original Spark abstraction. A **fault-tolerant, distributed collection** of objects.

- **Resilient** = can recover from node failures (knows how it was created)
- **Distributed** = split across multiple nodes
- **Dataset** = a collection of records

```python
rdd = spark.sparkContext.parallelize([1, 2, 3, 4, 5])
rdd.map(lambda x: x * 2).collect()
# [2, 4, 6, 8, 10]
```

> **When to use RDD today:** Rarely. Use DataFrames instead. RDDs are lower-level, harder to optimize, and lack schema awareness. You'll mostly see them in legacy code.

---

### 3.2 DataFrame

The modern Spark abstraction. Think of it like a **SQL table or pandas DataFrame**, but:
- Distributed across a cluster
- Lazy (operations build a plan, not results)
- Optimized by Spark's **Catalyst optimizer** (rewrites your query for efficiency)

```python
df = spark.read.csv("data.csv", header=True, inferSchema=True)
df.show(5)
```

This is what you'll use 95% of the time.

---

### 3.3 Dataset

A typed version of DataFrame — only available in Scala/Java. In Python, DataFrame = Dataset[Row], so in PySpark, you just use DataFrames.

---

## 4. SparkSession — Your Entry Point

`SparkSession` is the single entry point to all Spark functionality.

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("MyApp") \
    .config("spark.some.config", "value") \
    .getOrCreate()
```

> **On Databricks:** `spark` is already available as a pre-built global variable in every notebook. You never need to create it manually.

### SparkContext vs SparkSession

| | SparkContext | SparkSession |
|---|---|---|
| Introduced | Spark 1.x | Spark 2.x |
| Purpose | Low-level RDD operations | Unified entry point (SQL + DataFrames + Streaming) |
| Access | `spark.sparkContext` | `spark` (the session itself) |

---

## 5. Reading & Writing Data

### Reading

```python
# CSV
df = spark.read.csv("path/to/file.csv", header=True, inferSchema=True)

# JSON
df = spark.read.json("path/to/file.json")

# Parquet (most common in production — columnar, compressed)
df = spark.read.parquet("path/to/file.parquet")

# Delta (Databricks native format)
df = spark.read.format("delta").load("path/to/delta_table")

# With explicit options
df = spark.read \
    .option("header", "true") \
    .option("inferSchema", "true") \
    .option("sep", ",") \
    .csv("path/to/file.csv")
```

### Writing

```python
# Write as Parquet (default)
df.write.parquet("output/path")

# Write as CSV
df.write.csv("output/path", header=True)

# Write modes
df.write.mode("overwrite").parquet("output/path")    # Overwrite if exists
df.write.mode("append").parquet("output/path")       # Add to existing
df.write.mode("ignore").parquet("output/path")       # Skip if exists
df.write.mode("error").parquet("output/path")        # Raise error if exists (default)

# Write as Delta
df.write.format("delta").mode("overwrite").save("output/delta_path")

# Save as table (Databricks / Hive metastore)
df.write.saveAsTable("my_database.my_table")
```

---

## 6. DataFrame Operations

### Inspecting a DataFrame

```python
df.show()                  # Print first 20 rows
df.show(5)                 # Print first 5 rows
df.show(5, truncate=False) # Don't truncate long column values

df.printSchema()           # Show column names + data types
df.schema                  # Returns a StructType object
df.dtypes                  # List of (column_name, dtype) tuples
df.columns                 # List of column names
df.count()                 # Number of rows (triggers execution)
df.describe().show()       # Summary statistics (count, mean, stddev, min, max)
df.summary().show()        # Extended stats including percentiles
```

### Basic DataFrame Creation

```python
from pyspark.sql import Row

# From a Python list
data = [("Alice", 30), ("Bob", 25), ("Charlie", 35)]
columns = ["name", "age"]
df = spark.createDataFrame(data, columns)

# From a list of Row objects
rows = [Row(name="Alice", age=30), Row(name="Bob", age=25)]
df = spark.createDataFrame(rows)
```

---

## 7. Transformations vs Actions

This is one of the most important concepts in Spark.

### Transformations — Lazy (return a new DataFrame)

```python
df.filter(df.age > 30)        # Filter rows
df.select("name", "age")      # Pick columns
df.withColumn("x", ...)       # Add/modify a column
df.groupBy("city").count()    # Group and aggregate
df.join(df2, "id")            # Join two DataFrames
df.orderBy("age")             # Sort
df.distinct()                 # Remove duplicates
df.drop("column_name")        # Drop a column
df.limit(100)                 # Take first N rows
df.union(df2)                 # Stack two DataFrames
```

### Actions — Eager (trigger execution, return a result)

```python
df.show()                     # Print rows
df.count()                    # Count rows
df.collect()                  # Return all rows to driver as Python list (⚠ use carefully on large data)
df.take(5)                    # Return first 5 rows to driver
df.first()                    # Return first row
df.toPandas()                 # Convert to pandas DataFrame (⚠ use on small data only)
df.write.parquet("path")      # Write to storage
```

> ⚠️ **Warning:** `.collect()` and `.toPandas()` pull all data to the driver. On large datasets, this can crash your driver. Only use on small DataFrames or after aggregation.

---

## 8. Working with Columns

### Column References — Three Ways

```python
from pyspark.sql.functions import col

df["age"]         # Method 1: subscript — most pandas-like
df.age            # Method 2: attribute — clean but breaks if column name has spaces
col("age")        # Method 3: col() function — most explicit and recommended
```

> **Best practice:** Use `col("column_name")` in production code — it's unambiguous and works in all contexts (especially inside functions and UDFs).

### Adding / Modifying Columns

```python
from pyspark.sql.functions import col, lit, upper, when

# Add a new column
df = df.withColumn("age_in_10_years", col("age") + 10)

# Modify an existing column
df = df.withColumn("name", upper(col("name")))

# Add a constant column
df = df.withColumn("country", lit("India"))

# Conditional column (like SQL CASE WHEN)
df = df.withColumn("age_group",
    when(col("age") < 18, "Minor")
    .when(col("age") < 60, "Adult")
    .otherwise("Senior")
)
```

### Renaming Columns

```python
df = df.withColumnRenamed("old_name", "new_name")

# Rename multiple at once
df = df.toDF("col1", "col2", "col3")  # Rename all by position
```

### Dropping Columns

```python
df = df.drop("unwanted_column")
df = df.drop("col1", "col2")
```

---

## 9. Filtering & Selecting Data

### Select (pick columns)

```python
df.select("name", "age").show()
df.select(col("name"), col("age") + 1).show()

# Select all except one column
df.select([c for c in df.columns if c != "id"]).show()
```

### Filter (pick rows)

```python
# Single condition
df.filter(col("age") > 30).show()
df.where(col("age") > 30).show()   # .where() is an alias for .filter()

# Multiple conditions
df.filter((col("age") > 30) & (col("city") == "Mumbai")).show()
df.filter((col("age") > 30) | (col("city") == "Delhi")).show()

# NOT condition
df.filter(~(col("city") == "Delhi")).show()

# Using SQL string syntax (also valid)
df.filter("age > 30 AND city = 'Mumbai'").show()

# IN / NOT IN
df.filter(col("city").isin(["Mumbai", "Delhi", "Bangalore"])).show()
df.filter(~col("city").isin(["Mumbai", "Delhi"])).show()

# LIKE (string pattern matching)
df.filter(col("name").like("A%")).show()      # Starts with A
df.filter(col("name").contains("raj")).show() # Contains "raj"
df.filter(col("name").startswith("Ra")).show()
df.filter(col("name").endswith("ar")).show()
```

---

## 10. Aggregations & GroupBy

### groupBy + aggregate

```python
from pyspark.sql.functions import count, sum, avg, max, min, countDistinct

# Single aggregation
df.groupBy("city").count().show()

# Multiple aggregations at once
df.groupBy("city").agg(
    count("*").alias("total_users"),
    avg("age").alias("avg_age"),
    max("salary").alias("max_salary"),
    min("salary").alias("min_salary"),
    countDistinct("department").alias("num_departments")
).show()
```

### agg() Without groupBy (whole DataFrame)

```python
from pyspark.sql.functions import sum

df.agg(
    sum("salary").alias("total_salary"),
    avg("age").alias("overall_avg_age")
).show()
```

### orderBy / sort

```python
df.orderBy("age").show()                          # Ascending (default)
df.orderBy(col("age").desc()).show()               # Descending
df.orderBy(col("city").asc(), col("age").desc())  # Multiple columns
```

---

## 11. Joins

### Join Syntax

```python
# Basic inner join
result = df1.join(df2, on="user_id", how="inner")

# Join on multiple columns
result = df1.join(df2, on=["user_id", "order_id"], how="inner")

# Join on expression (when column names differ)
result = df1.join(df2, df1.id == df2.user_id, how="left")
```

### Join Types

| Join Type | `how=` value | Behavior |
|---|---|---|
| Inner Join | `"inner"` | Only rows with matches in both |
| Left Join | `"left"` or `"left_outer"` | All rows from left, matched from right (nulls if no match) |
| Right Join | `"right"` or `"right_outer"` | All rows from right, matched from left |
| Full Outer | `"outer"` or `"full"` | All rows from both, nulls where no match |
| Left Semi | `"left_semi"` | Rows from left that HAVE a match in right (no right columns) |
| Left Anti | `"left_anti"` | Rows from left that DO NOT have a match in right |
| Cross Join | `"cross"` | Cartesian product — every row × every row |

```python
# Left anti join: find customers who never placed an order
customers_without_orders = customers.join(orders, "customer_id", "left_anti")
```

### Handling Duplicate Column Names After Join

```python
# If both DataFrames have a column named "name", you'll have ambiguity
# Solution 1: rename before join
df2 = df2.withColumnRenamed("name", "product_name")

# Solution 2: drop the duplicate after join
result = df1.join(df2, df1.id == df2.id).drop(df2.id)
```

---

## 12. Window Functions

Window functions perform calculations across a **"window" of rows** related to the current row — similar to SQL window functions.

```python
from pyspark.sql.functions import row_number, rank, dense_rank, lag, lead, sum, avg
from pyspark.sql.window import Window

# Define a window: partition by city, order by salary descending
window_spec = Window.partitionBy("city").orderBy(col("salary").desc())

# Row number within each city (1, 2, 3... — no ties)
df = df.withColumn("row_num", row_number().over(window_spec))

# Rank within each city (1, 1, 3 — ties share a rank, next rank skipped)
df = df.withColumn("rank", rank().over(window_spec))

# Dense rank (1, 1, 2 — ties share a rank, no gaps)
df = df.withColumn("dense_rank", dense_rank().over(window_spec))

# Running total of salary within city
running_window = Window.partitionBy("city").orderBy("salary").rowsBetween(Window.unboundedPreceding, Window.currentRow)
df = df.withColumn("running_total", sum("salary").over(running_window))

# Lag: previous row's value (useful for comparing to previous period)
df = df.withColumn("prev_salary", lag("salary", 1).over(window_spec))

# Lead: next row's value
df = df.withColumn("next_salary", lead("salary", 1).over(window_spec))
```

### Window Frame Boundaries

```python
# All rows in the partition
Window.unboundedPreceding   # from the very first row
Window.unboundedFollowing   # to the very last row
Window.currentRow           # the current row

# Rolling 3-row window (current + 2 before)
rolling_window = Window.partitionBy("city").orderBy("date") \
    .rowsBetween(-2, Window.currentRow)
```

---

## 13. User Defined Functions (UDFs)

A UDF lets you apply custom Python logic to a Spark column.

### Standard UDF (slower — goes through Python serialization)

```python
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType

def clean_name(name):
    if name is None:
        return None
    return name.strip().title()

# Register the UDF
clean_name_udf = udf(clean_name, StringType())

# Apply it
df = df.withColumn("cleaned_name", clean_name_udf(col("name")))
```

### Pandas UDF / Vectorized UDF (faster — uses Arrow, batch processing)

```python
from pyspark.sql.functions import pandas_udf
from pyspark.sql.types import StringType
import pandas as pd

@pandas_udf(StringType())
def clean_name_pandas(names: pd.Series) -> pd.Series:
    return names.str.strip().str.title()

df = df.withColumn("cleaned_name", clean_name_pandas(col("name")))
```

> **Performance tip:** Always prefer Pandas UDFs over standard UDFs. Standard UDFs serialize row-by-row to Python (slow). Pandas UDFs work in batches using Apache Arrow (much faster).
>
> **Even better:** Before writing any UDF, check if a built-in `pyspark.sql.functions` function already does what you need. Built-ins run on the JVM and are significantly faster than any Python UDF.

---

## 14. Handling Null Values

```python
from pyspark.sql.functions import col, when, coalesce, isnan

# Check for nulls
df.filter(col("age").isNull()).show()
df.filter(col("age").isNotNull()).show()

# Count nulls per column
from pyspark.sql.functions import count, when
df.select([count(when(col(c).isNull(), c)).alias(c) for c in df.columns]).show()

# Drop rows with any null
df.dropna().show()

# Drop rows where specific columns are null
df.dropna(subset=["age", "city"]).show()

# Drop rows where ALL columns are null
df.dropna(how="all").show()

# Fill nulls
df.fillna(0)                             # Fill all numeric nulls with 0
df.fillna({"age": 0, "city": "Unknown"}) # Fill per column

# coalesce: return first non-null value from a list of columns
df = df.withColumn("effective_city", coalesce(col("city"), col("region"), lit("Unknown")))
```

---

## 15. Schema Management

### Why Schema Matters

`inferSchema=True` is convenient but slow (Spark reads the data twice — once to infer, once to load). For production, **always define the schema explicitly**.

### Defining a Schema

```python
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType, BooleanType, TimestampType

schema = StructType([
    StructField("user_id",   IntegerType(),   nullable=False),
    StructField("name",      StringType(),    nullable=True),
    StructField("age",       IntegerType(),   nullable=True),
    StructField("salary",    DoubleType(),    nullable=True),
    StructField("is_active", BooleanType(),   nullable=True),
    StructField("created_at",TimestampType(), nullable=True),
])

df = spark.read.schema(schema).csv("data.csv", header=True)
```

### DDL Schema String (shorthand, valid alternative)

```python
schema_ddl = "user_id INT, name STRING, age INT, salary DOUBLE"
df = spark.read.schema(schema_ddl).csv("data.csv", header=True)
```

### Common PySpark Data Types

| Python Type | PySpark Type |
|---|---|
| `int` | `IntegerType()` / `LongType()` |
| `float` | `FloatType()` / `DoubleType()` |
| `str` | `StringType()` |
| `bool` | `BooleanType()` |
| `datetime` | `TimestampType()` |
| `date` | `DateType()` |
| `list` | `ArrayType(elementType)` |
| `dict` | `MapType(keyType, valueType)` |
| nested object | `StructType([...])` |

---

## 16. Partitioning & Performance

### What is a Partition?

A partition is a **chunk of your data**. Spark processes each partition as one task, in parallel. More partitions = more parallelism (up to the number of CPU cores available).

```
DataFrame
├── Partition 1  → Task 1 → Executor Core 1
├── Partition 2  → Task 2 → Executor Core 2
├── Partition 3  → Task 3 → Executor Core 3
└── Partition 4  → Task 4 → Executor Core 4
```

### Checking & Changing Partitions

```python
# Check number of partitions
df.rdd.getNumPartitions()

# Repartition (full shuffle — use when you need more partitions or even distribution)
df = df.repartition(8)
df = df.repartition(8, "city")   # Partition by column value (same city → same partition)

# Coalesce (reduce partitions without a full shuffle — cheaper)
df = df.coalesce(4)
```

### Rule of Thumb

- Aim for **128MB–256MB per partition**
- For a cluster with `N` CPU cores, start with **2–4× N** partitions
- `coalesce` to reduce, `repartition` to increase or redistribute

### Writing with Partitioning (on disk)

```python
# Store data partitioned by column — great for querying subsets later
df.write.partitionBy("country", "year").parquet("output/path")
```

This creates a folder structure like `output/path/country=India/year=2024/...`, enabling partition pruning when reading.

---

## 17. Caching & Persistence

When you use a DataFrame multiple times (e.g., in a loop, or in multiple branches of your pipeline), Spark would recompute it from scratch each time. **Caching** avoids this.

```python
# Cache in memory (default)
df.cache()        # Lazy — caches on first action
df.persist()      # Same as cache()

# Explicit storage level
from pyspark import StorageLevel
df.persist(StorageLevel.MEMORY_AND_DISK)  # Spill to disk if RAM is full
df.persist(StorageLevel.DISK_ONLY)
df.persist(StorageLevel.MEMORY_ONLY_SER)  # Serialized (less RAM, slower)

# Always unpersist when done to free memory
df.unpersist()
```

### Storage Levels

| Level | In Memory | On Disk | Serialized | Notes |
|---|---|---|---|---|
| `MEMORY_ONLY` | ✅ | ❌ | ❌ | Fastest, uses most RAM |
| `MEMORY_AND_DISK` | ✅ | ✅ | ❌ | Spills to disk if needed |
| `DISK_ONLY` | ❌ | ✅ | ✅ | Slowest, least RAM |
| `MEMORY_ONLY_SER` | ✅ | ❌ | ✅ | Less RAM than MEMORY_ONLY |

> **When to cache:** Cache a DataFrame if it's used in 2+ actions downstream in the same pipeline. Don't cache everything — it wastes memory.

---

## 18. Spark SQL

You can write plain SQL against Spark DataFrames by registering them as **temporary views**.

```python
# Register a DataFrame as a temporary view
df.createOrReplaceTempView("users")

# Now query it with SQL
result = spark.sql("""
    SELECT city, COUNT(*) as user_count, AVG(age) as avg_age
    FROM users
    WHERE age > 18
    GROUP BY city
    ORDER BY user_count DESC
""")

result.show()
```

### Temporary vs Global Temporary Views

| | Scope | Syntax |
|---|---|---|
| `createOrReplaceTempView` | Current Spark session only | `FROM view_name` |
| `createOrReplaceGlobalTempView` | Across sessions (same app) | `FROM global_temp.view_name` |

> **PySpark = SQL.** You can mix DataFrame API and SQL freely. The query optimizer (Catalyst) produces the same execution plan either way. Use whichever is clearer for the task.

---

## 19. PySpark with Delta Lake (Databricks)

Delta Lake is the default storage format in Databricks. It adds ACID transactions and versioning on top of Parquet files.

### Creating a Delta Table

```python
# Write DataFrame as Delta
df.write.format("delta").mode("overwrite").save("/delta/users")

# Or as a table in the metastore
df.write.format("delta").saveAsTable("users")
```

### Reading Delta

```python
df = spark.read.format("delta").load("/delta/users")
```

### MERGE (Upsert) — Delta's Superpower

```python
from delta.tables import DeltaTable

delta_table = DeltaTable.forPath(spark, "/delta/users")

delta_table.alias("target").merge(
    new_data.alias("source"),
    "target.user_id = source.user_id"
).whenMatchedUpdateAll() \
 .whenNotMatchedInsertAll() \
 .execute()
```

### Time Travel — Query Historical Versions

```python
# By version number
df = spark.read.format("delta").option("versionAsOf", 3).load("/delta/users")

# By timestamp
df = spark.read.format("delta").option("timestampAsOf", "2024-01-01").load("/delta/users")
```

### Delta Utilities

```python
# View table history
delta_table.history().show()

# Optimize (compact small files)
delta_table.optimize().executeCompaction()

# Vacuum (remove old files beyond retention period)
delta_table.vacuum(retentionHours=168)  # 7 days
```

---

## 20. Common Debugging & Optimization Tips

### Reading the Explain Plan

```python
df.explain()           # Physical plan
df.explain("extended") # Logical + physical plan
df.explain("cost")     # With cost estimates
```

### Key Optimization Strategies

| Problem | Solution |
|---|---|
| Slow join on large + large tables | Use broadcast join if one table is small |
| Too many small files | Run `OPTIMIZE` on Delta tables |
| Skewed data (some partitions much larger) | Repartition by a higher-cardinality column |
| Recomputing same data multiple times | Cache the DataFrame |
| Using Python UDFs | Switch to Pandas UDFs or built-in functions |
| Reading entire large dataset | Apply filter early, use partitioned storage |

### Broadcast Join — For Joining a Small Table to a Large One

```python
from pyspark.sql.functions import broadcast

# Without broadcast: Spark shuffles both tables (expensive)
result = big_df.join(small_df, "id")

# With broadcast: small_df is sent to every executor (no shuffle of big_df)
result = big_df.join(broadcast(small_df), "id")
```

> Rule of thumb: broadcast tables smaller than ~10MB (auto-broadcast threshold is 10MB by default, configurable via `spark.sql.autoBroadcastJoinThreshold`).

### Avoiding Common Mistakes

```python
# ❌ Don't do this — iterating row by row is not Spark
for row in df.collect():
    process(row)

# ✅ Do this — use vectorized operations
df = df.withColumn("result", some_function(col("input")))

# ❌ Don't use Python UDFs for simple string/math ops
udf_upper = udf(lambda x: x.upper(), StringType())

# ✅ Use built-in functions
from pyspark.sql.functions import upper
df = df.withColumn("name", upper(col("name")))
```

---

## 21. Interview Questions

---

### Conceptual Questions

**Q1. What is lazy evaluation in Spark and why does it exist?**

Lazy evaluation means Spark does not execute transformations immediately. Instead, it builds a DAG (Directed Acyclic Graph) of all planned operations and only runs them when an action is called. This allows Spark's Catalyst optimizer to analyze the full plan before execution — reordering operations, pushing filters early, and merging stages for efficiency. Without lazy evaluation, every intermediate step would materialize data unnecessarily.

---

**Q2. What is the difference between a transformation and an action?**

Transformations are lazy operations that return a new DataFrame (e.g., `filter`, `select`, `join`, `withColumn`). They do not trigger execution. Actions are eager operations that trigger the execution of the full DAG and return a result to the driver or write to storage (e.g., `count`, `collect`, `show`, `write`). Every action triggers one Spark job.

---

**Q3. What is a Spark job, stage, and task? How are they related?**

- A **Job** is created per action call. One action = one job.
- A **Stage** is a set of tasks that can run without a data shuffle. Jobs are broken into stages at shuffle boundaries.
- A **Task** is the smallest unit — one task processes one partition. All tasks in a stage run in parallel.

---

**Q4. What is a shuffle? Why is it expensive?**

A shuffle is the redistribution of data across partitions — required when Spark needs to group or sort data across the cluster (e.g., for `groupBy`, `join`, `orderBy`). It's expensive because it involves writing data to disk, transferring it over the network, and reading it back — all of which are slow compared to in-memory computation.

---

**Q5. What is the difference between `repartition` and `coalesce`?**

Both change the number of partitions. `repartition(n)` does a full shuffle to evenly redistribute data across `n` partitions — used when increasing partitions or when even distribution is needed. `coalesce(n)` reduces partitions without a full shuffle by merging existing ones — it's more efficient when you only need to decrease the number of partitions (e.g., before writing output).

---

**Q6. What is the difference between `cache()` and `persist()`?**

`cache()` is a shorthand for `persist(StorageLevel.MEMORY_ONLY)`. `persist()` allows you to specify the storage level (memory, disk, serialized, etc.). Both are lazy — the DataFrame is actually cached on the first action that triggers its computation.

---

**Q7. When would you use a broadcast join?**

When joining a large DataFrame with a small one (typically < 10MB). Broadcasting sends the small table to every executor, eliminating the need to shuffle the large table. This is a major performance optimization when the size difference is significant.

---

**Q8. What is the Catalyst Optimizer?**

Catalyst is Spark's query optimization engine. It takes your logical plan (the sequence of transformations you wrote), applies a series of optimization rules (filter pushdown, predicate pushdown, constant folding, join reordering), and produces an optimized physical execution plan. This is why writing Spark SQL or DataFrame API code can produce the same efficient plan.

---

**Q9. Why are Pandas UDFs faster than standard Python UDFs?**

Standard UDFs serialize and deserialize data row-by-row between the JVM (where Spark runs) and Python. This is extremely slow. Pandas UDFs use Apache Arrow for zero-copy, columnar data transfer in batches, dramatically reducing serialization overhead. Built-in Spark functions are fastest because they run entirely on the JVM without Python involvement.

---

**Q10. What is the difference between `Row`, `StructType`, and `StructField`?**

- `StructType` defines the schema of a DataFrame — it's a list of `StructField` objects.
- `StructField` defines a single column: its name, data type, and whether it's nullable.
- `Row` is a single record in a DataFrame, accessible like a named tuple.

---

### Practical / Code Questions

**Q11. How do you find and count null values in each column of a DataFrame?**

```python
from pyspark.sql.functions import col, count, when

df.select([
    count(when(col(c).isNull(), c)).alias(c)
    for c in df.columns
]).show()
```

---

**Q12. How do you get the top N rows per group?**

Use a window function with `row_number()`:

```python
from pyspark.sql.functions import row_number
from pyspark.sql.window import Window

window = Window.partitionBy("city").orderBy(col("salary").desc())
df = df.withColumn("rank", row_number().over(window))
df.filter(col("rank") <= 3).drop("rank").show()
```

---

**Q13. What is the difference between `rank()`, `dense_rank()`, and `row_number()`?**

Given salaries: 100, 100, 90:

| Function | Results |
|---|---|
| `row_number()` | 1, 2, 3 (always unique, no ties) |
| `rank()` | 1, 1, 3 (ties get same rank, next rank skipped) |
| `dense_rank()` | 1, 1, 2 (ties get same rank, no gaps) |

---

**Q14. How do you perform a cumulative sum in PySpark?**

```python
from pyspark.sql.functions import sum
from pyspark.sql.window import Window

window = Window.partitionBy("category") \
    .orderBy("date") \
    .rowsBetween(Window.unboundedPreceding, Window.currentRow)

df = df.withColumn("cumulative_sales", sum("sales").over(window))
```

---

**Q15. How do you pivot a DataFrame (rows to columns)?**

```python
df.groupBy("user_id").pivot("month").agg(sum("sales")).show()
```

This creates one column per unique value in the `month` column.

---

**Q16. What does `explode()` do?**

`explode()` is used to flatten an array column into individual rows.

```python
from pyspark.sql.functions import explode

# Original: {"user_id": 1, "tags": ["python", "spark", "databricks"]}
# After explode: three rows, one per tag

df = df.withColumn("tag", explode(col("tags")))
```

---

**Q17. How do you handle schema evolution in Delta Lake?**

```python
# Allow schema to automatically evolve (add new columns)
df.write.format("delta") \
    .option("mergeSchema", "true") \
    .mode("append") \
    .save("/delta/path")

# For overwrite with schema change
spark.conf.set("spark.databricks.delta.schema.autoMerge.enabled", "true")
```

---

**Q18. What is Z-ordering in Delta Lake?**

Z-ordering is a data layout optimization that co-locates related data in the same set of files. When you query with filters on Z-ordered columns, Spark can skip irrelevant files entirely (data skipping), dramatically reducing I/O.

```python
delta_table.optimize().executeZOrderBy("user_id", "event_date")
```

---

**Q19. How would you read only a specific partition from a partitioned Parquet dataset?**

```python
# Spark's partition pruning automatically applies when you filter on partition columns
df = spark.read.parquet("output/path") \
    .filter(col("country") == "India")
# Spark reads only the India partition folder — skips everything else
```

---

**Q20. What is the difference between `saveAsTable` and `save` in PySpark?**

- `.save("path")` writes data to a storage path as files (Parquet, Delta, etc.) but doesn't register it in the metastore.
- `.saveAsTable("db.table_name")` writes data AND registers the table in the Hive/Unity Catalog metastore, making it queryable by name across sessions and tools (like Databricks SQL).

---

*End of PySpark Mastery Notes*

---

> 💡 **Pro tip for Databricks specifically:** In Databricks notebooks, Spark is already configured and `spark` is pre-initialized. Use `%sql` magic to run SQL directly in a cell, and `display(df)` instead of `df.show()` for a richer interactive table view.