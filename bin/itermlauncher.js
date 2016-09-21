#!/usr/bin/env node

var applescript = require('applescript'),
    childProcess = require('child_process'),
    fs = require('fs'),
    Menu = require('terminal-menu'),
    path = require('path-extra'),
    plist = require('plist');


function getIterm2Config(config) {
    let data;

    if (config.plistFilename) {
        data = fs.readFileSync(config.plistFilename, 'utf8');
    } else {
        data = childProcess.execSync(
            'defaults export com.googlecode.iterm2 -').toString();
    }

    return plist.parse(data);
}

function buildEntries(config) {
    const plistData = getIterm2Config(config);
    const requiredTags = config.requiredTags || [];
    const itermBookmarks = plistData['New Bookmarks'];
    let entries = [];

    itermBookmarks.forEach(bookmark => {
        let valid = true;
        let tags = {};

        bookmark.Tags.forEach(tag => {
            tags[tag] = true;
        });

        valid = requiredTags.every(tag => {
            return tags.hasOwnProperty(tag);
        });

        if (valid) {
            entries.push(bookmark.Name);
        }
    });

    return entries
}

function buildMenu(config, menuEntries) {
    const NUM_DEFAULT_ITEMS = 5;

    function onError(err, rtn) {
        menu.close();

        console.log('Failed to launch the session: %s', err);
        process.exit(1);
    };

    const menuWidth = config.menuWidth || 50;
    const menuHeight = NUM_DEFAULT_ITEMS + menuEntries.length;
    const horizPadding = Math.floor((process.stdout.columns - menuWidth) / 2.0);
    const vertPadding = Math.floor((process.stdout.rows - menuHeight) / 2.0);

    const menu = Menu({
        width: menuWidth,
        x: 0,
        y: 0,
        bg: config.bg,
        fg: config.fg,
        padding: {
            left: horizPadding,
            right: horizPadding,
            top: vertPadding,
            bottom: vertPadding,
        }
    });

    menu.setMaxListeners(0);
    menu.reset();

    menu.write('Launch a Terminal\n');
    menu.write('=================\n\n');

    menu.add('Default Terminal', () => {
        launchProfile(config, 'Default', onError);
    });

    menu.write('\n');

    menuEntries.forEach(entry => {
        menu.add(entry, () => {
            launchProfile(config, entry, onError);
        });
    });

    menu.on('close', () => {
        process.stdin.setRawMode(false);
        process.stdin.end();
    });

    process.stdin.pipe(menu.createStream()).pipe(process.stdout);
    process.stdin.setRawMode(true);
}

function launchProfile(config, name, onError) {
    let script;

    if (config.itermVersion === 3) {
        script = [
            'tell application "iTerm"',
            '    tell current window',
            '        create tab with profile "' + name + '"',
            '    end tell',
            'end tell'
        ];
    } else {
        script = [
            'tell application "iTerm"',
            '    tell the current terminal',
            '        launch session "' + name + '"',
            '    end tell',
            'end tell'
        ];
    }

    applescript.execString(script.join('\n'), (err, rtn) => {
        if (err) {
            onError(err, rtn);
        }
    });
}

function readConfig(filename) {
    if (fs.existsSync(filename)) {
        try {
            return require(filename);
        } catch (e) {
            console.log('Failure when parsing configuration file "%s": %s',
                        filename, e);
            process.exit(1);
        }
    }

    return {};
}

function main() {
    if (process.argv.length === 3) {
        configFilename = process.argv[2];
    } else {
        configFilename = path.join(path.homedir(), '.config',
                                   'itermlauncher', 'config.json');
    }

    config = readConfig(configFilename);

    buildMenu(config, buildEntries(config));
}

main();
