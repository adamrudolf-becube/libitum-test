# libitum-test

## Disclaimer on performance

This application is not optimized for performance. This is for two reasons: first of all, this is not a production environment and is exremely small anyway, I don't expect any performance issues. Secondly, since this is for demonstration purposes I preferred clean, structured design to performance. Collecting all CSS to one file, minifying CSS and JS, and render React server side would be some of the examples I would have done differently in a bigger and real project.

## Notes about React used

I used React for frontend rendering. I need to mention 2 things:

* I knew what React was and what the main concepts were, but otherwise I learned what I used for this project, while doing it, building this project practically from React tutorial. Please consider the React parts accordingly. My emphasis was on the backend.
* This React code is not optimised, it is built in a way to be the least complex to create and not the most optimal to be run. I am aware of that. (In this little project it doesn't really matter anyway.)

## Design

Since fronted is not really my field, I decided either to use default html or something I find in the Internet. I reused some okay looking solutions from W3Schools. Very minimal CSS is written by me.

* I used the checkbox design from [here](https://www.w3schools.com/howto/howto_css_custom_checkbox.asp)
* I used the button design from [here](https://www.w3schools.com/howto/howto_css_alert_buttons.asp)
* Table design is a mixture from [here](https://www.w3schools.com/howto/howto_css_comparison_table.asp), [here](https://www.w3schools.com/css/css_table.asp) and some own modifications to separate saved and unsaved history.