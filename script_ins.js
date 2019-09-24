var check = {};

check['lastName'] = function (id) {

    var name = document.getElementById(id);
      
   
    if(name.value.length >= 2) {
        name.className = 'correct';
        return true;
    }
    else {
        name.className = 'incorrect';
        return false;
    }

};

check['firstName'] = check['lastName']; // La fonction pour le prénom est la même que celle du nom


check['login'] = function () {

    var login = document.getElementById('login');
        
    if (login.value.length >= 4) {
        login.className = 'correct';

        return true;
    } else {
        login.className = 'incorrect';
      
        return false;
    }

};

check['pwd1'] = function () {

    var pwd1 = document.getElementById('pwd1');
       

    if (pwd1.value.length >= 6) {
        pwd1.className = 'correctpw';
      
        return true;
    } else {
        pwd1.className = 'incorrectpw';
       
        return false;
    }

};

check['pwd2'] = function () {

    var pwd1 = document.getElementById('pwd1');
    pwd2 = document.getElementById('pwd2');
       

    if (pwd1.value == pwd2.value && pwd2.value != '') {
        pwd2.className = 'correctpw';
       
        return true;
    } else {
        pwd2.className = 'incorrectpw';
      
        return false;
    }

};

check['email'] = function () {

    var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
    var email = document.getElementById('email');
      

    if (regex.test(email.value)) {
        email.className = 'correct';
       
        return true;
    } else {
        pwd1.className = 'incorrect';
       
        return false;
    }

};

check['email2'] = function () {

    var email = document.getElementById('email');
    email2 = document.getElementById('email2');
      

    if (email.value == email2.value && email2.value != '') {
        email2.className = 'correctm';
      
        return true;
    } else {
        email2.className = 'incorrectm';
       
        return false;
    }

};

// Mise en place des événements

(function () {

    var myForm = document.getElementById('myForm');
        inputs = document.querySelectorAll('input[type=text], input[type=password], input[type=email]'),
        inputsLength = inputs.length;

    for (var i = 0; i < inputsLength; i++) {
        inputs[i].addEventListener('keyup', function (e) {
            check[e.target.id](e.target.id); 
        });
    }

    myForm.addEventListener('submit', function (e) {

        var result = true;

        for (var i in check) {
            result = check[i](i) && result;
        }

        if (result) {
            alert('Le formulaire est bien rempli. Vous êtes inscrit !');
        }

        e.preventDefault();

    });


  

})();
