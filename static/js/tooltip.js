var Tooltip = {};
Tooltip.create = function(text, primaryButtonObject, secondaryButtonObject) {
	var tooltip = document.createElement('div');
	var tooltipButtons = document.createElement('div');
	var triangleWhite = document.createElement('div');
	var triangleGray = document.createElement('div');
	var primaryButton, secondaryButton;

	function removeToolTip() {
		tooltip.parentNode.removeChild(tooltip);
		document.querySelector('.tooltip-modal-cover').classList.toggle('tooltip-modal-cover-hidden');
	}

	tooltip.classList.add('tooltip');
	tooltipButtons.classList.add('tooltip-buttons');
	triangleWhite.setAttribute('class', 'triangle-white');
	triangleGray.setAttribute('class', 'triangle-gray');

	if(primaryButtonObject) {
		primaryButton = document.createElement('div');
		primaryButton.setAttribute(
			'class',
			'button' + (primaryButtonObject.colour ? ' btn-' + primaryButtonObject.colour : '')
		);
		primaryButton.innerHTML = primaryButtonObject.text;

		primaryButton.addEventListener('click', function(ev) {
			if(primaryButtonObject.eventListener) {
				ev.removeTooltip = removeToolTip;
				primaryButtonObject.eventListener(ev);
			} else {
				removeToolTip();
			}
		});

		tooltipButtons.appendChild(primaryButton);
	}
	if(secondaryButtonObject) {
		secondaryButton = document.createElement('div');
		secondaryButton.setAttribute(
			'class',
			'button' + (secondaryButtonObject.colour ? ' btn-' + secondaryButtonObject.colour : '')
		);
		secondaryButton.innerHTML = secondaryButtonObject.text;

		secondaryButton.addEventListener('click', function(ev) {
			if(secondaryButtonObject.eventListener) {
				ev.removeTooltip = removeToolTip;
				secondaryButtonObject.eventListener(ev);
			} else {
				removeToolTip();
			}
		});

		tooltipButtons.appendChild(secondaryButton);
	}

	tooltip.innerHTML = text;
	tooltip.appendChild(triangleGray);
	tooltip.appendChild(triangleWhite);
	tooltip.appendChild(tooltipButtons);

	return tooltip;
}

Tooltip.isTooltip = function(el) {
	if(el === document.body || el === null) {
		return false;
	} else if(el.classList.contains('tooltip')) {
		return el;
	} else {
		return this.isTooltip(el.parentNode);
	}
}

Tooltip.onClick = function(querySelector, text, primaryButtonObject, secondaryButtonObject) {
	if(!this.createdModalCover) {
		var modalDiv = document.createElement('div');
		modalDiv.setAttribute('class', 'tooltip-modal-cover tooltip-modal-cover-hidden');

		document.body.appendChild(modalDiv);

		modalDiv.addEventListener('click', function() {
			[].forEach.call(document.body.querySelectorAll('.tooltip'), function(tooltip) {
				tooltip.parentNode.removeChild(tooltip);
			});
			this.classList.toggle('tooltip-modal-cover-hidden');
		})

		this.createdModalCover = true;
	}
	document.body.addEventListener('click', function(ev) {
		var el = document.querySelector(querySelector);
		if(!el || !el.contains(ev.target)) return;
		
		[].forEach.call(document.body.querySelectorAll('.tooltip'), function(tooltip) {
			tooltip.parentNode.removeChild(tooltip);
		})

		var tooltip = Tooltip.create(
			text,
			primaryButtonObject,
			secondaryButtonObject
		);

		var rect = el.getBoundingClientRect();
		var viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

		document.querySelector('.tooltip-modal-cover').classList.toggle('tooltip-modal-cover-hidden');

		tooltip.style.left = 'calc(' + rect.left + 'px + (10rem - ' + el.clientWidth + 'px) / -2)';
		tooltip.style.top = 'calc(0.5rem + ' + rect.bottom + 'px)';

		tooltip.querySelector('.triangle-gray').style.left = 'calc(' + rect.left + 'px + ' + el.offsetWidth + 'px /2 - 0.5rem + 1px)';
		tooltip.querySelector('.triangle-gray').style.top = rect.bottom + 'px';

		tooltip.querySelector('.triangle-white').style.left = 'calc(' + rect.left + 'px + ' + el.offsetWidth + 'px /2 - 0.5rem + 3px)';
		tooltip.querySelector('.triangle-white').style.top = rect.bottom + 3 + 'px';

		if(!Tooltip.isTooltip(ev.target) && !ev.target.querySelector('.tooltip')) {
			document.body.appendChild(tooltip);

			if(tooltip.getBoundingClientRect().right > viewPortWidth) {
				tooltip.style.left = '';
				tooltip.style.right = '0.5rem';
			} else if(tooltip.getBoundingClientRect().left <= 16) {
				tooltip.style.left = '0.5rem';
			}
		}
	})
}