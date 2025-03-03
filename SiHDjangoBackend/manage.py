#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
import uvicorn  # Import Uvicorn


def main():
    """Run administrative tasks."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "SiHDjangoBackend.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    # Check for runserver command and use Uvicorn instead
    if "runserver" in sys.argv:
        port = int(os.getenv("PORT", 8000))  # Get the port from the environment variable or default to 8000
        uvicorn.run(
            "SiHDjangoBackend.asgi:application",  # ASGI application path
            host="0.0.0.0",  # Bind to all network interfaces
            port=port,
            log_level="info",
        )
    else:
        execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
