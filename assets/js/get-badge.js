/* =========================
    Classes
   ========================= */

class Rectangle {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }

    // Getter
    get area() {
        return this.calcArea();
    }

    // Method
    calcArea() {
        return this.height * this.width;
    }
}


/* =========================
    jQuery
   ========================= */
$(function (event) {
    var urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results[1] || 0;
    }

    var loadingPage = function (event) {
        return ("<div class='cover-container'><header class='masthead clearfix'>" +
            "</header><main role='main' class='inner cover'>" +
            "<img src='" + globalUrl.loader + "' width='200px' />" +
            "</main>" +
            "<footer class='mastfoot'></footer></div>");
    }

    var checkValue = function (input) {
        if (input.val() == "") {
            input.addClass("is-invalid");
            input.on("input", function (event) {
                if (input.val() != "") {
                    input.removeClass("is-invalid");
                    input.addClass("is-valid");
                } else {
                    input.removeClass("is-valid");
                    input.addClass("is-invalid");
                }
            });
        }
    }

    var checkPasswords = function (arrayOfFields) {
        if (arrayOfFields[0].val() != arrayOfFields[1].val()) {
            arrayOfFields[1].removeClass("is-valid");
            arrayOfFields[1].addClass("is-invalid");
            arrayOfFields[1].on("input", function (event) {
                if (arrayOfFields[1].val()) {
                    arrayOfFields[1].removeClass("is-invalid");
                    arrayOfFields[1].addClass("is-valid");
                } else {
                    arrayOfFields[1].removeClass("is-valid");
                    arrayOfFields[1].addClass("is-invalid");
                }
            });
            return false;
        } else {
            return true;
        }
    }

    var showGetOpenBadges = function () {
        $("#gb-wrap").fadeOut(400, function (event) {
            $("#gb-wrap").html(loadingPage());
            var data = {
                'action': 'ajaxGbShowGetOpenBadges',
                'json': urlParam('json'),
            };

            jQuery.post(
                globalUrl.ajax,
                data,
                function (response) {
                    $("#gb-wrap").html(response);
                }
            );
        }).delay(400).fadeIn(400);
    }

    var showConslusion = function () {
        $("#gb-wrap").fadeOut(400, function (event) {
            $("#gb-wrap").html(loadingPage());
            var data = {
                'action': 'ajaxGbShowConclusion',
            };

            jQuery.post(
                globalUrl.ajax,
                data,
                function (response) {
                    $("#gb-wrap").html(response);
                }
            );
        }).delay(400).fadeIn(400);
    }

    var executeAsync = function(func) {
        setTimeout(func, 0);
    }



    $(document).on("click", "#getBadge", function (event) {
        $("#gb-wrap").fadeOut(400, function (event) {
            $("#gb-wrap").html(loadingPage());

            var data = {
                'action': 'ajaxGbShowLogin',
                'json': urlParam('json'),
            };

            jQuery.post(
                globalUrl.ajax,
                data,
                function (response) {
                    $("#gb-wrap").html(response);
                }
            );
        }).delay(400).fadeIn(400);
    });

    /*
     * LOGIN page
     */

    $(document).on("submit", "#gb-form-login", function (event) {
        event.preventDefault();

        var email = $("#staticEmail").val();
        var password = $("#inputPassword").val();
        var remember = $("#inputRemember").is(':checked');

        var data = {
            'action': 'ajaxGbLogin',
            'user_email': email,
            'user_password': password,
            'remember': remember,
        };

        jQuery.post(
            globalUrl.ajax,
            data,
            function (response) {
                if (response != true) {
                    $("#gb-resp-login").html(response);
                } else {
                    showGetOpenBadges();
                }

            }
        );
    });

    /*
     * REGISTER page
     */
    $(document).on("submit", "#gb-form-registration", function (event) {
        event.preventDefault();
        $("#gb-resp-register").html("");

        var inputFields = [
            $(this).find("#reg-email"),
            $(this).find("#reg-user-name"),
            $(this).find("#reg-first-name"),
            $(this).find("#reg-last-name"),
            $(this).find("#reg-pass"),
            $(this).find("#reg-repeat-pass"),
        ];


        if (/*checkPasswords(passwFields) == false || */this.checkValidity() === false) {

            event.stopPropagation();

            inputFields.forEach(function (field) {
                checkValue(field);
            });

        } else {

            var data = {
                'action': 'ajaxGbRegistration',
                'user_email': inputFields[0].val(),
                'user_name': inputFields[1].val(),
                'first_name': inputFields[2].val(),
                'last_name': inputFields[3].val(),
                'user_pass': inputFields[4].val(),
                'user_rep_pass': inputFields[5].val(),
            };

            jQuery.post(
                globalUrl.ajax,
                data,
                function (response) {
                    if (response == 0) {
                        showGetOpenBadges();
                    } else if (response) {
                        $("#gb-resp-register").html(response);
                    }
                }
            );
        }
        this.classList.add('was-validated');
    });


    /*
     * GET BADGE page
     */

    $(document).on("click", "#gb-ob-get-badge", function (event) {
        // BAD function, don't keep out from the comment
        /*
        executeAsync(function() {
            for(;;) {
                $(this).html("•");
                setTimeout(function(){
                    $(this).html("• •");
                }, 500);
                setTimeout(function(){
                    $(this).html("• • •");
                }, 500);
            }
        });*/

        var data = {
            'action': 'ajaxGbGetJsonUrl',
            'json': urlParam('json'),
        };

        jQuery.post(
            globalUrl.ajax,
            data,
            function (response) {
                OpenBadges.issue([response], function (errors, successes) {

                    if (successes.length) {
                        showConslusion();
                    } else if (errors.length) {
                        showConslusion();
                        //$("#gb-ob-response").html("Badge not sent!")
                    }
                });
            }
        );

    });


});
