import glob, py_compile, sys

def test_all_py_compile():
    files = glob.glob("**/*.py", recursive=True)
    assert files, "no python files found"
    for f in files:
        if "/.git/" in f:
            continue
        py_compile.compile(f, doraise=True)
