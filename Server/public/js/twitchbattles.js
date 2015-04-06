/*
	Using jQuery here as it is loaded for Foundation5 and easier for people to follow. 
	If this changes, get using default javascript.
*/

var TwitchBattles = TwitchBattles || {};

TwitchBattles.Registration = (function() {

	// Constructor
	function Registration() {
		this.getFields();
		this.addEventHanlders();
	};

	// using jQuery as it's already loaded with Foundation, or would do this natively.
	Registration.prototype.getFields = function() {
		this.formElement = jQuery('form');
        this.usernameElement = jQuery('input[name="username"]');
        this.passwordElement = jQuery('input[name="password"]');
        this.passwordconfirmElement = jQuery('input[name="passwordconfirm"]');
        this.submitElement = jQuery('input[type="submit"]');
	};

	Registration.prototype.addEventHanlders = function() {
		// Add events for username textbox.
		if (this.usernameElement !== null && this.usernameElement.length > 0) {
			this.usernameElement.on('keyup blur change paste', function() {
				this.validateElement(this.usernameElement, 2);
			}.bind(this));
		}
		// Add events for password textbox.
		if (this.passwordElement !== null && this.passwordElement.length > 0) {
			this.passwordElement.on('keyup blur change paste', function() {
				this.validateElement(this.passwordElement, 6);
			}.bind(this));
		}
		// Add events for password confirmation textbox.
		if (this.passwordconfirmElement !== null && this.passwordconfirmElement.length > 0) {
			this.passwordconfirmElement.on('keyup change paste', function() {
				this.validateElement(this.passwordconfirmElement, 6, this.passwordElement);
			}.bind(this));
		}
		// Add events for submit button.
		if (this.submitElement !== null && this.submitElement.length > 0) {

			this.submitElement.click(function(e) {
				e.preventDefault();

				var formValid = this.validateForm();

				if (formValid && this.formElement !== null)
					this.formElement.submit();

			}.bind(this));
		}
	};

	Registration.prototype.validateForm = function() {
		
		var usernameValid = this.validateElement(this.usernameElement, 2);
		var passwordValid = this.validateElement(this.passwordElement, 6);
		var passwordconfirmValid = this.validateElement(this.passwordconfirmElement, 6, this.passwordElement);

		if (!usernameValid || !passwordValid || !passwordconfirmValid)
			return false;

        return true;

	};

	Registration.prototype.validateElement = function(element, minlength, compareTo) {

		var value = "";
		var comparison = "";

		if (element !== null) {
			value = element.val().trim();
		}
		if (compareTo !== null && compareTo !== undefined) {
			comparison = compareTo.val().trim();
		}


		if (value.length >= minlength) {

			if (compareTo !== null && compareTo !== undefined) {

				if (value !== comparison) {
					element.addClass('invalid');
					element.removeClass('valid');
					return false;
				} else {
					element.addClass('valid');
					element.removeClass('invalid');
					return true;
				}

			} else {
				element.addClass('valid');
				element.removeClass('invalid');
				return true;
			}
			

		} else {

			element.addClass('invalid');
			element.removeClass('valid');
			return false;

		}
	};



	return Registration;
})();

TwitchBattles.Countdown = (function() {

	// Contstructor
	function Countdown() {
		this.getFields();
		this.timeRemaining = this.getTimeUntilNextBattle();
		this.populateField();
	};

	// Retrieve time until next battle
	Countdown.prototype.getTimeUntilNextBattle = function() {
		// TODO Get time until next battle from server.
	};

	// Get the field that will show the time until next battle.
	Countdown.prototype.getFields = function() {
		this.timeRemainingField = jQuery('.timeRemaining');
	};

	// Retrieve time until next battle
	Countdown.prototype.populateField = function() {
		if (this.timeRemainingField !== null && this.timeRemainingField.length > 0) {
			
			// Use clientside to do countdown, and re-poll server when countdown reaches 0 etc etc.
		}
	};

	return Countdown();
})();