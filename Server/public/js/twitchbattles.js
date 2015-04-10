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
	}

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

TwitchBattles.Login = (function() {

	// Constructor
	function Login() {
		this.getFields();
		this.addEventHanlders();
	}

	Login.prototype.getFields = function() {
		this.formElement = jQuery('form');
		this.usernameElement = jQuery('input[name="username"]');
		this.passwordElement = jQuery('input[name="password"]');
		this.submitElement = jQuery('input[type="submit"]');
	};

	Login.prototype.addEventHanlders = function() {
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

	Login.prototype.validateForm = function() {
		
		var usernameValid = this.validateElement(this.usernameElement, 2);
		var passwordValid = this.validateElement(this.passwordElement, 6);

		if (!usernameValid || !passwordValid)
			return false;

		return true;

	};

	Login.prototype.validateElement = function(element, minlength, compareTo) {

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

	return Login;
})();

TwitchBattles.Countdown = (function() {

	// Contstructor
	function Countdown(url) {
		
		// Set defaults
		this.countdown = 0;
		this.worldState = {};
		this.url = url;
		this.getFields();
		
		// Get world state on intial load.
		this.getWorldState(this.url);

		this.decrementCountdown();

	}

	// Retrieve time until next battle
	Countdown.prototype.getWorldState = function(url) {
		jQuery.get(url, function(data) {
			
			this.worldState = data;

			// Setup next world state update
			this.scheduleNextWorldStateUpdate();

			this.populateField();

		}.bind(this));
	};

	// Get the field that will show the time until next battle.
	Countdown.prototype.getFields = function() {
		this.countdownText = jQuery('.game-status');
		this.countdownTime = jQuery('.game-countdown');
	};

	// Retrieve time until next battle
	Countdown.prototype.populateField = function() {
		if (this.countdownText !== null && this.countdownText.length > 0) {
			
			// Game not active.
			if (!this.worldState.game_active) {
				this.countdownText.html('No battles are available at this time, please check back later.');
			} else if (!this.worldState.round_active) {
				// Round not active, next round in XXs
				this.countdown = (this.worldState.between_round_length - this.worldState.round_timer).toFixed(0);
				this.countdownText.html('Next battle commences in <span class="game-countdown">' + this.getFriendlyCountdownText(this.countdown) + '</span>, are you ready?');
			} else {
				// Round active, next round in XXs
				this.countdown = (this.worldState.round_length - this.worldState.round_timer).toFixed(0);
				this.countdownText.html('Battle in progress, next round starts in <span class="game-countdown">' + this.getFriendlyCountdownText(this.countdown) + '</span>.');
			}

			
		}
	};

	// This will schedule the next world state update. This will get the world state at the end of the round.
	Countdown.prototype.scheduleNextWorldStateUpdate = function() {

		// Clear existing timeout.
		if (this.timeoutId > 0)
			clearTimeout(this.timeoutId);

		if (this.worldState.round_timer > 0) {
			var refresh = (this.countdown * 1000);
			
			if (refresh < 0) {
				refresh = 60000;
			}

			this.timeoutId = setTimeout(this.getWorldState.bind(this), refresh, this.url);
		}

		if (!this.worldState.game_active) {
			this.timeoutId = setTimeout(this.getWorldState.bind(this), 60000, this.url);
		}
	};

	Countdown.prototype.decrementCountdown = function() {

		setInterval(function() {
			if (this.countdown > 1)
				this.countdown--;

			// Reset the fields, incase the game countdown field isn't in the dom when this is called.
			this.getFields();

			this.countdownTime.text(this.getFriendlyCountdownText(this.countdown));

		}.bind(this), 1000);
	};

	Countdown.prototype.getFriendlyCountdownText = function(countdown) {

		var hours = Math.floor(countdown / 3600);
		var minutes = Math.floor((countdown - (hours * 3600)) / 60);
		var seconds = countdown - (hours * 3600) - (minutes * 60);


		var time = (hours > 0 ? hours + "h " : "");
			time += (minutes > 0 ? minutes + "m " : "");
			time += (seconds > 0 ? seconds + "s" : "");

		return time.trim();

	};

	return Countdown;
})();