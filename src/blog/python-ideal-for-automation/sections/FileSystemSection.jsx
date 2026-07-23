import { CodeBlock } from "../components/CodeBlock";

/* ── FILE SYSTEM ──────────────────────── */
export function FileSystemSection() {
  return (
    <>
      <h2 id="file-system">File System Libraries</h2>
      <p>
        File manipulation is the entry point for most automation engineers. Whether you are organising downloads, cleaning up log files, or building a backup system, Python's file system libraries handle it in a few lines of idiomatic code.
      </p>

      <h3>os — Operating System Interface</h3>
      <p>
        The <code>os</code> module is Python's direct line to the operating system. It lets you walk directory trees, read and set environment variables, manage processes, check file metadata, and create or remove paths. It predates modern Python but remains indispensable for low-level operations.
      </p>
      <CodeBlock
        filename="os_example.py"
        note="Walk directory tree and report large files"
        code={`import os

# Recursively find all files larger than 100 MB
for root, dirs, files in os.walk("/home/user/data"):
    for filename in files:
        path = os.path.join(root, filename)
        size_mb = os.path.getsize(path) / (1024 * 1024)
        if size_mb > 100:
            print(f"Large file: {path} ({size_mb:.1f} MB)")

# Always read secrets from environment, never hardcode them
db_url = os.environ.get("DATABASE_URL", "sqlite:///local.db")
api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY must be set")`}
      />

      <h3>pathlib — Modern Path Handling</h3>
      <p>
        <code>pathlib</code> (Python 3.4+) replaces string-based path manipulation with an object-oriented API. Paths become <code>Path</code> objects you can join with <code>/</code>, glob with patterns, and query with <code>.stem</code>, <code>.suffix</code>, <code>.parent</code>. It is the modern way to write file automation.
      </p>
      <CodeBlock
        filename="pathlib_example.py"
        note="Bulk rename files using pathlib's clean API"
        code={`from pathlib import Path
from datetime import date

downloads = Path.home() / "Downloads"

# Rename all .jpeg files to .jpg (bulk normalise extension)
renamed = 0
for f in downloads.glob("**/*.jpeg"):
    new_name = f.with_suffix(".jpg")
    f.rename(new_name)
    renamed += 1
print(f"Renamed {renamed} files")

# Create an organised output directory tree
output = Path("output") / str(date.today()) / "reports"
output.mkdir(parents=True, exist_ok=True)
print(f"Output directory ready: {output.resolve()}")`}
      />

      <h3>shutil — High-Level File Operations</h3>
      <p>
        <code>shutil</code> handles the operations that <code>os</code> and <code>pathlib</code> do not — copying directory trees, moving files across volumes, creating archives, and deleting entire folders. Its most common automation use is building daily backup scripts.
      </p>
      <CodeBlock
        filename="backup.py"
        note="Automated daily backup with zip archive"
        code={`import shutil
from pathlib import Path
from datetime import date

def run_backup(source: str, dest_base: str) -> Path:
    source_path = Path(source)
    dated_dest = Path(dest_base) / str(date.today())

    # Copy the full directory tree
    shutil.copytree(source_path, dated_dest)

    # Compress it into a zip archive
    archive = shutil.make_archive(str(dated_dest), "zip", dated_dest)

    # Remove the uncompressed copy to save space
    shutil.rmtree(dated_dest)

    return Path(archive)

archive = run_backup("important_data", "backups")
size_kb = archive.stat().st_size // 1024
print(f"Backup complete: {archive.name} ({size_kb} KB)")`}
      />
    </>
  );
}
