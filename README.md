iTermLauncher for iTerm2
========================

iTermLauncher is a handy console-based menu for quickly launching new
terminals within the same window using iTerm2.

This is intended for use with the iTerm2 Hotkey window, for launching
additional terminals within that window. I personally use it to keep all my
development servers or SSH sessions in reach, all within the hotkey window.

Once launched, the menu will remain running until you hit Control-C or Q.
It will scan all the profiles you have configured (optionally filtering by
tags), and let you choose one to launch within the window.


Installing iTermLauncher
------------------------

Installation is simple. Just make sure you have node.js installed, and run:

    $ sudo npm -g install less

To run it, just run:

    $ itermlauncher


Configuring iTermLauncher
-------------------------

Configuration is completely optional. iTermLauncher will find all your
profiles and do the right thing.

There are a few configuration options, though. You can set the foreground/background colors, the width of the menu, an exported iTerm2 plist file, and the
list of tags required for a profile to appear.

If you want to change things, create a JSON file in
`~/.config/itermlauncher/config.json`. This can look something like:

    {
		"bg": "black",
		"fg": "yellow",
		"menuWidth": 50,
		"requiredTags": [
		    "Dev Servers"
		],
	    "plistFilename": "/path/to/com.googlecode.iterm2.plist"
	}

The one you most likely want to set is `requiredTags`. Any profile appearing
in the menu must have all of the listed tags.

You can also specify a custom configuration file as an argument when running
`itermlauncher`:

    $ itermlauncher my-config.json


Configuring iTerm2
------------------

You'll want to make this easy and basically automatic. I suggest hooking this
up to the hotkey window. Just follow these steps:

1. Go into the iTerm2 profile editor and select the profile for your
   Hotkey window (or create it if it doesn't exist).
2. In the General tab for the profile, set Command to: `itermlauncher`
3. In the Keys settings, under Hotkey, make sure both checkboxes are checked,
   set your desired hotkey, and make sure it's mapped to the profile you
   just configured.
4. Press the hotkey. Tada!


License
-------

iTermLauncher is MIT-licensed.

Copyright (c) 2015  Christian Hammond

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
