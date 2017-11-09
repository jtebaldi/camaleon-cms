function cama_get_tinymce_settings(settings){
    if(!settings) settings = {};
    var def = {
        selector: ".tinymce_textarea",
        plugins: "advlist autolink lists link image charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking save table contextmenu directionality emoticons template paste textcolor colorpicker textpattern filemanager variable",
        menubar: "edit insert view format table tools",
        image_advtab: true,
        statusbar: true,
        paste: true,
        toolbar_items_size: 'small',
        content_css: tinymce_global_settings["custom_css"].join(","),
        convert_urls: false,
        //forced_root_block: '',
        extended_valid_elements: 'i[*],div[*],p[*],li[*],a[*],ol[*],ul[*],span[*]',
        toolbar: "bold italic | alignleft aligncenter alignright alignjustify | fontselect fontsizeselect | bullist numlist | outdent indent | undo redo | link unlink image media | forecolor backcolor | styleselect template "+tinymce_global_settings["custom_toolbar"].join(","),
        image_caption: true,
        language: CURRENT_LOCALE,
        relative_urls: false,
        remove_script_host: false,
        browser_spellcheck : true,
        variable_valid: ["contact_name", "contact_email", "site_name", "site_email", "site_phone", "site_address", "site_logo"],
        variable_mapper: {
            contact_name: 'Contact Name',
            contact_email: 'Contact Email',
            site_name: 'Site Name',
            site_email: 'Site Email',
            site_phone: 'Site Phone',
            site_address: 'Site Address',
            site_logo: 'Site Logo',
        },
        variable_class: 'variable',
        language_url: tinymce_global_settings["language_url"],
        file_browser_callback: function(field_name, url, type, win) {
            $.fn.upload_filemanager({
                formats: type,
                selected: function(file, response){
                    $('#' + field_name).val(file.url);
                }
            });
        },
        setup: function (editor) {
            editor.addButton('contact_forms', {
              type: 'menubutton',
              text: 'Contact Form',
              icon: false,
              menu: [
              {
                text: 'Contact Name',
                onclick: function() {
                  editor.plugins.variable.addVariable('contact_name');
                }
              }, 
              {
                text: 'Contact Email',
                onclick: function() {
                  editor.plugins.variable.addVariable('contact_email');
                }
              }, {
                text: 'Site Name',
                onclick: function() {
                  editor.plugins.variable.addVariable('site_name');
                }
              }, {
                text: 'Site Email',
                onclick: function() {
                  editor.plugins.variable.addVariable('site_email');
                }
              }, {
                text: 'Site Phone',
                onclick: function() {
                  editor.plugins.variable.addVariable('site_phone');
                }
              }, {
                text: 'Site Address',
                onclick: function() {
                  editor.plugins.variable.addVariable('site_address');
                }
              }, {
                text: 'Site Logo',
                onclick: function() {
                  editor.plugins.variable.addVariable('site_logo');
                }
              }]
            });

            editor.on('blur', function () {
                tinymce.triggerSave();
                $('textarea#'+editor.id).trigger('change');
            });

            editor.addMenuItem('append_line', {
                text: 'New line at the end',
                context: 'insert',
                onclick: function () { editor.dom.add(editor.getBody(), 'p', {}, '-New line-');  }
            });

            editor.addMenuItem('add_line', {
                text: 'New line',
                context: 'insert',
                onclick: function () { editor.insertContent('<p>-New line-</p>');  }
            });

            editor.addMenuItem('add_contact_name', {
                text: 'Contact Name',
                context: 'campagin',
                onclick: function () { editor.insertContent('<p>-New line-</p>');  }
            });

            // eval all extra setups
            for(var ff in tinymce_global_settings["setups"]) tinymce_global_settings["setups"][ff](editor);

            editor.on('postRender', function(e) {
                editor.settings.onPostRender(editor);
                // eval all extra setups
                for(var ff in tinymce_global_settings["post_render"]) tinymce_global_settings["post_render"][ff](editor);
            });

            editor.on('init', function(e) {
                for(var ff in tinymce_global_settings["init"]) tinymce_global_settings["init"][ff](editor);
            });
        },
        onPostRender: function(editor){}
    };
    for(var ff in tinymce_global_settings["settings"]) tinymce_global_settings["settings"][ff](settings, def);
    return $.extend({}, def, settings);
}