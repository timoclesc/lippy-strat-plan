import enterView from 'enter-view';

var animations = document.querySelectorAll('[xyz]');

if ( animations ) {
	animations.forEach(
		(el, i) => {
			el.classList.add('xyz-out');
	}); 
	
	enterView({
		selector: '[xyz]',
		enter: function(el) {
			var xyz = el.getAttribute('xyz');

			el.classList.add('xyz-in');
			el.classList.remove('xyz-out');
		},
		offset: 0.25, // enter at middle of viewport
		once: true, // trigger just once
	});
}