#!/usr/bin/env python3
"""
Drive the Wallpaper Reactor desktop app on a virtual display and capture screenshots
for tutorials. Everything here talks raw X11 through python-xlib, because this machine
has no xdotool or wmctrl and the GNOME session is usually locked.

Typical session:

    Xvfb :99 -screen 0 1200x2000x24 -ac &
    JAVA_HOME=~/.gradle/jdks/jetbrains_s_r_o_-21-amd64-linux.2 \\
      DISPLAY=:99 ./gradlew :composeApp:run          # in the app repo

    python3 scripts/app-capture.py resize 1280 720   # desktop layout
    python3 scripts/app-capture.py resize 400 711    # phone layout, two-column compact
    python3 scripts/app-capture.py click 148 670
    python3 scripts/app-capture.py scroll 200 400 5
    python3 scripts/app-capture.py shot /tmp/step1.png

Then annotate with scripts/annotate-screenshot.mjs.

Notes learned the hard way:
  - The app needs JBR 21. System Java 17 fails with UnsupportedClassVersionError.
  - Without a window manager, WindowPlacement.Maximized is ignored and the window comes
    up 800x600 — hence `resize`.
  - 400px wide puts the app in its two-column compact layout, which is what a phone shows.
    540px gives three columns, which does not look like a phone.
  - Capture at a size where the UI is legible: 1280x720 reads far better than 1920x1080.
"""
import subprocess
import sys
import time

try:
    from Xlib import X, display
    from Xlib.ext import xtest
except ImportError:
    sys.exit("python-xlib is required:  pip install --user python-xlib")

DISPLAY = ":99"
TITLE = "Wallpaper Reactor"


def connect():
    try:
        return display.Display(DISPLAY)
    except Exception as e:
        sys.exit(f"cannot connect to {DISPLAY}: {e}\nIs Xvfb running?")


def find_window(d, timeout=420):
    """The app window, waiting for it to appear — a cold Gradle build takes a while."""
    root = d.screen().root

    def walk(w, depth=0):
        for child in w.query_tree().children:
            try:
                if TITLE in (child.get_wm_name() or ""):
                    return child
            except Exception:
                pass
            if depth < 3:
                found = walk(child, depth + 1)
                if found:
                    return found
        return None

    deadline = time.time() + timeout
    while time.time() < deadline:
        win = walk(root)
        if win:
            return win
        time.sleep(3)
    sys.exit(f"no window titled {TITLE!r} on {DISPLAY} after {timeout}s")


def cmd_resize(width, height):
    d = connect()
    win = find_window(d)
    win.configure(x=0, y=0, width=width, height=height)
    d.sync()
    time.sleep(2)
    geom = win.get_geometry()
    print(f"resized to {geom.width}x{geom.height}")


def cmd_click(x, y):
    d = connect()
    d.screen().root.warp_pointer(x, y)
    d.sync()
    time.sleep(0.4)
    xtest.fake_input(d, X.ButtonPress, 1)
    d.sync()
    time.sleep(0.12)
    xtest.fake_input(d, X.ButtonRelease, 1)
    d.sync()
    time.sleep(0.2)
    print(f"clicked {x},{y}")


def cmd_scroll(x, y, notches):
    d = connect()
    button = 5 if notches > 0 else 4
    d.screen().root.warp_pointer(x, y)
    d.sync()
    time.sleep(0.3)
    for _ in range(abs(notches)):
        xtest.fake_input(d, X.ButtonPress, button)
        d.sync()
        xtest.fake_input(d, X.ButtonRelease, button)
        d.sync()
        time.sleep(0.25)
    print(f"scrolled {notches}")


def cmd_shot(path, width=None, height=None):
    """Crop to the window by default, so a small window on a big screen still frames right."""
    if width is None or height is None:
        d = connect()
        geom = find_window(d).get_geometry()
        width, height = geom.width, geom.height
    subprocess.run(
        ["import", "-window", "root", "-crop", f"{width}x{height}+0+0", path],
        env={"DISPLAY": DISPLAY, "PATH": "/usr/bin:/bin"},
        check=True,
    )
    print(f"{path}  ({width}x{height})")


USAGE = """usage:
  app-capture.py resize <w> <h>
  app-capture.py click <x> <y>
  app-capture.py scroll <x> <y> <notches>     positive scrolls down
  app-capture.py shot <path> [w] [h]
"""

if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        sys.exit(USAGE)
    command, rest = args[0], args[1:]
    if command == "resize":
        cmd_resize(int(rest[0]), int(rest[1]))
    elif command == "click":
        cmd_click(int(rest[0]), int(rest[1]))
    elif command == "scroll":
        cmd_scroll(int(rest[0]), int(rest[1]), int(rest[2]))
    elif command == "shot":
        cmd_shot(rest[0], *(int(v) for v in rest[1:3]))
    else:
        sys.exit(USAGE)
