# Libitum test

This project is part of my interview process at [Libitum](https://libitum.com/). The task was to create a whole, but very simple webapplication, both backend and frontend. Since I applied to a backend position, and also my profile fits it more, I mostly concentrated on the backend part, and functional part and not so much on design.

## How to install

1. Clone or download this repository.
2. Create a database with a user who has read and write access to it. I used MySQL with phpMyAdmin interface as a part of XAMPP bundle.
3. In the database create a table named `selectionhistory`. (The table name is hard coded in `history.php`.) To do this, just import `selectionhistory.sql` or run the SQL in it. You can also see the details of my system in this file. (And yes, sorry the auto generated comments are in Hungarian.)
4. Copy `config-example.php` to `config.php` and change the values of the constants to fit your database setup.
5. Start a PHP server and have fun.

## Requirements I got

> You will build a website that presents three "products" (boxes) of which one is selectable from the start.
> 
> When the user selects the selectable product, one of the other products must be made selectable
> 
> When the user then selects product two, the third product should be selected automatically and not be unselectable.
> 
> If the user then unselects product two then product three should be automatically unselected and if product one is unselected then product two and three should be automatically unselected.
> 
> The site should also have a save function that saves the choices to a database.
> 
> Present the history of the choices on the site.
> 
> The site should be built with object-oriented PHP with a MySQL database (another database solution is ok). The front-end shall be made in HTML / CSS & JS
> 
> There should be a readme to help us get started.

## Technical solutions

Most of the described logic needs to be done on the frontend. There are multiple components which need to be updated based on each other's state. As far as I knew React makes these simpler. I chose React to implement the frontend. Note that I did not use react before this testproject so everything you see in React I learned for this project.

For backend I used what I already had: XAMPP for Windows 7.2.12 (PHP 7.2.12), with phpMyAdmin 4.8.3.

### Notes about React used

I used React for frontend rendering. I need to mention 2 things:

* I knew what React was and what the main concepts were, but otherwise I learned what I used for this project, while doing it, building this project practically from React tutorial. Please consider the React parts accordingly.
* This React code is not optimised, it is built in a way to be the least complex to create and not the most optimal to be run. I am aware of that. (In this little project it doesn't really matter anyway.)

### Backend solutions

* I have not used any backend frameworks to implement the server side of the REST API. At one point I started to install Laravel but after a short consideration I decided that for this size of a project it would be a complex task to set it up from zero.
* I used object oriented mysqli to connect to the database. I wrapped it to my own class to open connection during construction and close it on desctruction so automatic garbage collection takes care of it so it reduces coupling.
* The login data to the database is stored in `config.php` in the root folder of this project. This file is ignored in `.gitignore`. It is to not store credentials in the Git repo. To see the structure see `config-example.php`. You should copy this file, rename it to `config.php` and fill it accordingly.
* There is one API endpoint, and the operation depends on the HTTP method type. Note that there are only API calls for bulk operations (e.g. you cannot delete one entry, only all of them). This is for simplicity, but in real life a more complex and secure API would be created.

## Conceptual solutions

### Data representation

There are 3 boxes, but Product 3's state is always the same as Product 2's, so we only have actually configuration of 2 product states. Additionally, Product 2 cannot be selected without Product 1. That gives us 3 possible configurations in total:

| Product 1 | Product 2 | Product 3 |
| :-------: | :-------: | :-------: |
|     -     |     -     |     -     |
|     X     |     -     |     -     |
|     X     |     X     |     X     |

We can decide how to represent that data:

* **Naive** - there is a boolean for each product. That gives us 8 different possible configurations, but the code logic limits it to the 3 above. This should be chosen if the business logic is expeced to be changed, for example if in the future Product 3 can be selected independently, this solution would not require database structure change.
* **Simplified** - there are 2 boolean values: for Product 1 and one common for Product 2 and 3. This one reflects the logic of the system better and gives us less room for mistakes. Also requires less data transfer between server and client and requires less storage capacity (not that it matters in this project). This is also intuitive, since there are 2 boxes the user can actually click on, so we store is what the user has selected.
* **Optimized** - we use only 1 variable which can take (minimum) 3 values, for example an integer which takes 0, 1 and 2 to represent those 3 states. Then we can create a graph which tells a specific action in a certain state reults in which state.

I prefer the **Simplified** solution over the **Naive**, mostly because this reflects how the system works and also simplifies the logic a bit, and more error prone. This is a test project and we obvioulsy don't want to pay price for future extendability so it's not a risk to not store a database field for Product 3 separately. **Optimized** is too contraintuitive and we don't need extra performance / storage that desperately, so I will go with **Simplified**, having 2 booleans.

Both database and JavaScript will use this data representation.

### Additional logic

I implemented some logic which was not among the requirements. I did this 1) because I found them quite simple and 2) to help myself to test my solutions. Normally my principle is not to do anything which is not required to reduce complexity, risks and development time. Consider this an exceptional case.

These features are the following:

* There is the table which shows the history. Different backgounds show the saved history (which is in the database) and the changes since the last save (unsaved history).
- Checkbox states
    - Every checkbox change is appended to unsaved history and immediately displayed on the
      history table.
    - If the application is started and database is empty, all checkboxes start unselected
      and table is empty.
    - If the application is started and database is not empty, checkboxes are set to the last 
      saved state and table shows the saved history.
 
- User actions
    - User can save the unsaved history to the database. Unsaved history gets empty and what
      was earlier in unsaved history, gets to the saved history (indirectly, through the database).
      Checkboxes are set to the last saved sate (no change in this case).
    - User can delete the unsaved history and return to the last saved state.
    - User can delete all (saved and unsaved) history. In this case the saved and unsaved history
      gets empty, database gets cleared and all checkboxes become unchecked.
 

### Disclaimer on performance

This application is not optimized for performance. This is for two reasons: first of all, this is not a production environment and is exremely small anyway, I don't expect any performance issues. Secondly, since this is for demonstration purposes I preferred clean, structured design to performance. Collecting all CSS to one file, minifying CSS and JS, and render React server side would be some of the examples I would have done differently in a bigger and real project.

## Design

Since fronted is not really my field, I decided either to use default html or something I find in the Internet. I reused some okay looking solutions from W3Schools. Very minimal CSS is written by me.

* I used the checkbox design from [here](https://www.w3schools.com/howto/howto_css_custom_checkbox.asp)
* I used the button design from [here](https://www.w3schools.com/howto/howto_css_alert_buttons.asp)
* Table design is a mixture from [here](https://www.w3schools.com/howto/howto_css_comparison_table.asp), [here](https://www.w3schools.com/css/css_table.asp) and some own modifications to separate saved and unsaved history.

## Contact

If you have questions and comments, contact me on `rudolf.adam.a@gmail.com` or on my [LinkedIn](https://www.linkedin.com/in/%C3%A1d%C3%A1m-rudolf-21795096/).