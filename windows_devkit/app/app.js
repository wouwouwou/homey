/*
 * Use this area to load your modules. Some module have been pre-loaded for you like codemirror, some widgets and custom icons
 */
 
//CORE
// editors
loadModule('codemirror', 	'editor',	'./core/components/editors/devkit-editor-codemirror/', ['ui.codemirror']);

// widgets
loadModule('svg', 			'widget',	'./core/components/widgets/devkit-widget-svg/');
loadModule('markdown', 		'widget',	'./core/components/widgets/devkit-widget-markdown/');

// APP
// editors
loadModule('manifest', 		'editor',	'./app/components/editors/devkit-homey-editor-manifest/');

// headers
loadModule('title', 		'header',	'./app/components/headers/devkit-homey-header-title/');
loadModule('auth', 			'header',	'./app/components/headers/devkit-homey-header-auth/');
loadModule('play', 			'header',	'./app/components/headers/devkit-homey-header-play/');

// widgets
loadModule('ledring', 		'widget',	'./app/components/widgets/ledring/');

// popups
loadModule('login',			'popup',	'./app/components/popups/login/');
loadModule('settings',		'popup',	'./app/components/popups/settings/');
loadModule('debug',			'popup',	'./app/components/popups/debug/');

// themes
loadModule('custom_icons',	'theme',	'./app/components/themes/custom_icons/');
loadModule('athom',			'theme',	'./app/components/themes/athom/');
loadModule('font-awesome',	'theme',	'./app/components/themes/font-awesome/');

// set codemirror options
var codemirrorOpts = {
	indentWithTabs: true,
	indentUnit: 4
}

window.localStorage.codemirrorOpts = JSON.stringify(codemirrorOpts);

/*
 * Use this area to define global settings for your app like the file editor config and devtools
 */
app.run(['$rootScope', '$timeout', '$file', '$menu', function($rootScope, $timeout, $file, $menu) {
	
	// set editor config
	$file.setConfig([
		{
			ext: ".svg",
			config: {
				widgets: [ 'svg' ]
			}
		},
		{
			ext: ".md",
			config: {
				widgets: [ 'markdown' ]
			}
		},
		{
			base: 'app.json',
			dir: '/',
			config: {
				editor: "manifest"
			}
		},
		{
			ext: '.js',
			dir: '/animations/',
			config: {
				widgets: [ 'ledring' ]
			}
		}
	]);
	
	$menu.setConfig([
		{
			id: 'file',
			label: 'File',
			submenu: [
				{
					id: 'project-new',
					label: 'New Project...',
					hotkey: 'meta+shift+n'
				},
				{
					id: 'project-open',
					label: 'Open Project...',
					hotkey: 'meta+shift+o'
				},
				{
					id: 'project-close',
					label: 'Close Project',
					hotkey: 'meta+shift+w'
				},			
				{
					type: 'separator'
				},		
				{
					id: 'file-new',
					label: 'New File',
					hotkey: 'meta+n'
				},	
				{
					id: 'folder-new',
					label: 'New File',
					hotkey: 'meta+alt+n'
				},
				{
					id: 'file-open',
					label: 'Open File',
					hotkey: 'meta+o'
				},
				{
					id: 'file-close',
					label: 'Close File',
					hotkey: 'meta+w'
				},
				{
					type: 'separator'
				},
				{
					id: 'save',
					label: 'Save',
					hotkey: 'meta+s'
				},
				{
					id: 'save-as',
					label: 'Save As...',
					hotkey: 'meta+shift+s'
				}
			]
		},
		{
			id: 'edit',
			label: 'Edit',
			submenu: [
				{
					id: 'cut',
					label: 'Cut',
					hotkey: 'meta+x'
				},
				{
					id: 'copy',
					label: 'Copy',
					hotkey: 'meta+c'
				},
				{
					id: 'paste',
					label: 'Paste',
					hotkey: 'meta+v'
				}
			]
		},
		{
			id: 'project',
			label: 'Project',
			submenu: [
				{
					id: 'project-run',
					label: 'Run',
					hotkey: 'meta+r'
				},
/*
				{
					id: 'project-runbrk',
					label: 'Run (break)',
					hotkey: 'meta+shift+r'
				}
*/
			]
		},
		{
			id: 'editor',
			label: 'Editor',
			submenu: [
				{
					id: 'devtools',
					label: 'Show Inspector',
					hotkey: 'meta+/'
				}
			]
		}
	]);
	
//	$rootScope.$on('menu.devtools', function(){
		require('nw.gui').Window.get().showDevTools();
//	});
	
}]);