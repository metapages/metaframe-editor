export const extensionMap: {[index: string]: string[]} = {
  "abap": ["abap"],
  "cls": ["apex", "openedge abl", "tex", "visual basic"],
  "clj": ["clojure"],
  "boot": ["clojure"],
  "cl2": ["clojure"],
  "cljc": ["clojure"],
  "cljs": ["clojure"],
  "cljs.hl": ["clojure"],
  "cljscm": ["clojure"],
  "cljx": ["clojure"],
  "hic": ["clojure"],
  "coffee": ["coffeescript"],
  "_coffee": ["coffeescript"],
  "cjsx": ["coffeescript"],
  "cson": ["coffeescript"],
  "iced": ["coffeescript"],
  "c": ["c"],
  "cats": ["c"],
  "h": ["c", "c++", "objective-c"],
  "idc": ["c"],
  "w": ["c"],
  "css": ["css"],
  "dart": ["dart"],
  "dockerfile": ["dockerfile"],
  "ecl": ["ecl", "prolog"],
  "eclxml": ["ecl"],
  "ex": ["elixir"],
  "exs": ["elixir"],
  "go": ["go"],
  "handlebars": ["handlebars"],
  "hbs": ["handlebars"],
  "html": ["html"],
  "htm": ["html"],
  "html.hl": ["html"],
  "st": ["html", "smalltalk"],
  "xht": ["html"],
  "xhtml": ["html"],
  "pro": ["idl", "ini", "prolog", "qmake"],
  "ini": ["ini"],
  "cfg": ["ini"],
  "prefs": ["ini"],
  "properties": ["ini"],
  "java": ["java"],
  "frag": ["glsl", "javascript"],
  "gs": ["gosu", "javascript"],
  "js": ["javascript"],
  "_js": ["javascript"],
  "bones": ["javascript"],
  "es6": ["javascript"],
  "jake": ["javascript"],
  "jsb": ["javascript"],
  "jsfl": ["javascript"],
  "jsm": ["javascript"],
  "jss": ["javascript"],
  "jsx": ["javascript"],
  "njs": ["javascript"],
  "pac": ["javascript"],
  "sjs": ["javascript"],
  "ssjs": ["javascript"],
  "sublime-build": ["javascript"],
  "sublime-commands": ["javascript"],
  "sublime-completions": ["javascript"],
  "sublime-keymap": ["javascript"],
  "sublime-macro": ["javascript"],
  "sublime-menu": ["javascript"],
  "sublime-mousemap": ["javascript"],
  "sublime-project": ["javascript"],
  "sublime-settings": ["javascript"],
  "sublime-theme": ["javascript"],
  "sublime-workspace": ["javascript"],
  "sublime_metrics": ["javascript"],
  "sublime_session": ["javascript"],
  "xsjs": ["javascript"],
  "xsjslib": ["javascript"],
  "jl": ["julia"],
  "kt": ["kotlin"],
  "ktm": ["kotlin"],
  "kts": ["kotlin"],
  "less": ["less"],
  "lua": ["lua"],
  "fcgi": ["lua", "php", "perl", "python", "ruby", "shell"],
  "nse": ["lua"],
  "pd_lua": ["lua"],
  "rbxs": ["lua"],
  "wlua": ["lua"],
  "liquid": ["liquid"],
  "md": ["markdown"],
  "markdown": ["markdown"],
  "mkd": ["markdown"],
  "mkdn": ["markdown"],
  "mkdown": ["markdown"],
  "ron": ["markdown"],
  "m": ["limbo", "m", "muf", "mathematica", "matlab", "mercury", "objective-c"],
  "pas": ["pascal"],
  "dfm": ["pascal"],
  "dpr": ["pascal"],
  "lpr": ["pascal"],
  "pp": ["pascal", "puppet"],
  "pl": ["perl", "perl6", "prolog"],
  "cgi": ["perl", "python", "shell"],
  "perl": ["perl"],
  "ph": ["perl"],
  "plx": ["perl"],
  "pm": ["perl", "perl6"],
  "pod": ["perl", "pod"],
  "psgi": ["perl"],
  "t": ["perl", "perl6", "turing"],
  "php": ["hack", "php"],
  "aw": ["php"],
  "ctp": ["php"],
  "php3": ["php"],
  "php4": ["php"],
  "php5": ["php"],
  "phpt": ["php"],
  "ps1": ["powershell"],
  "psd1": ["powershell"],
  "psm1": ["powershell"],
  "py": ["python"],
  "gyp": ["python"],
  "lmi": ["python"],
  "pyde": ["python"],
  "pyp": ["python"],
  "pyt": ["python"],
  "pyw": ["python"],
  "tac": ["python"],
  "wsgi": ["python"],
  "xpy": ["python"],
  "r": ["r", "rebol"],
  "rd": ["r"],
  "rsx": ["r"],
  "rst": ["restructuredtext"],
  "rest": ["restructuredtext"],
  "rb": ["ruby"],
  "builder": ["ruby"],
  "gemspec": ["ruby"],
  "god": ["ruby"],
  "irbrc": ["ruby"],
  "jbuilder": ["ruby"],
  "mspec": ["ruby"],
  "pluginspec": ["ruby", "xml"],
  "podspec": ["ruby"],
  "rabl": ["ruby"],
  "rake": ["ruby"],
  "rbuild": ["ruby"],
  "rbw": ["ruby"],
  "rbx": ["ruby"],
  "ru": ["ruby"],
  "ruby": ["ruby"],
  "thor": ["ruby"],
  "watchr": ["ruby"],
  "rs": ["renderscript", "rust"],
  "scala": ["scala"],
  "sbt": ["scala"],
  "sc": ["scala", "supercollider"],
  "sls": ["saltstack", "scheme"],
  "scm": ["scheme"],
  "sld": ["scheme"],
  "sps": ["scheme"],
  "ss": ["scheme"],
  "scss": ["scss"],
  "sh": ["shell"],
  "bash": ["shell"],
  "bats": ["shell"],
  "command": ["shell"],
  "ksh": ["shell"],
  "tmux": ["shell"],
  "tool": ["shell"],
  "zsh": ["shell"],
  "sparql": ["sparql"],
  "rq": ["sparql"],
  "sql": ["plsql", "plpgsql", "sql", "sqlpl"],
  "cql": ["sql"],
  "ddl": ["sql"],
  "prc": ["sql"],
  "tab": ["sql"],
  "udf": ["sql"],
  "viw": ["sql"],
  "swift": ["swift"],
  "sv": ["systemverilog"],
  "svh": ["systemverilog"],
  "vh": ["systemverilog"],
  "v": ["coq", "verilog"],
  "veo": ["verilog"],
  "tcl": ["tcl"],
  "adp": ["tcl"],
  "tm": ["tcl"],
  "twig": ["twig"],
  "ts": ["typescript", "xml"],
  "mm": ["objective-c++", "xml"],
  "xml": ["xml"],
  "ant": ["xml"],
  "axml": ["xml"],
  "ccxml": ["xml"],
  "clixml": ["xml"],
  "cproject": ["xml"],
  "csproj": ["xml"],
  "ct": ["xml"],
  "dita": ["xml"],
  "ditamap": ["xml"],
  "ditaval": ["xml"],
  "dll.config": ["xml"],
  "filters": ["xml"],
  "fsproj": ["xml"],
  "fxml": ["xml"],
  "glade": ["xml"],
  "grxml": ["xml"],
  "ivy": ["xml"],
  "jelly": ["xml"],
  "kml": ["xml"],
  "launch": ["xml"],
  "mxml": ["xml"],
  "nproj": ["xml"],
  "nuspec": ["xml"],
  "odd": ["xml"],
  "osm": ["xml"],
  "plist": ["xml"],
  "ps1xml": ["xml"],
  "psc1": ["xml"],
  "pt": ["xml"],
  "rdf": ["xml"],
  "rss": ["xml"],
  "scxml": ["xml"],
  "srdf": ["xml"],
  "storyboard": ["xml"],
  "stTheme": ["xml"],
  "sublime-snippet": ["xml"],
  "targets": ["xml"],
  "tmCommand": ["xml"],
  "tml": ["xml"],
  "tmLanguage": ["xml"],
  "tmPreferences": ["xml"],
  "tmSnippet": ["xml"],
  "tmTheme": ["xml"],
  "ui": ["xml"],
  "urdf": ["xml"],
  "vbproj": ["xml"],
  "vcxproj": ["xml"],
  "vxml": ["xml"],
  "wsdl": ["xml"],
  "wsf": ["xml"],
  "wxi": ["xml"],
  "wxl": ["xml"],
  "wxs": ["xml"],
  "x3d": ["xml"],
  "xacro": ["xml"],
  "xaml": ["xml"],
  "xib": ["xml"],
  "xlf": ["xml"],
  "xliff": ["xml"],
  "xmi": ["xml"],
  "xml.dist": ["xml"],
  "xsd": ["xml"],
  "xul": ["xml"],
  "zcml": ["xml"],
  "yml": ["yaml"],
  "reek": ["yaml"],
  "rviz": ["yaml"],
  "yaml": ["yaml"],
  "json": ["json"],
  "lock": ["json"]
}