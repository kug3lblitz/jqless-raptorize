(function() {

    function extend(defaults, options) {
        var extended = {};
        for (var prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }
        for (var prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }
        return extended;
    }

    function raptorize(element, options) {
        var defaults = {  
            enterOn: 'click', //timer, konami-code, click
            delayTime: 5000 //time before raptor attacks on timer mode
        };  
        
        options = extend(defaults, options); 

        var audioSupported = false;
        var audio = new Audio();
        if (audio.canPlayType('audio/mpeg') || audio.canPlayType('audio/ogg')) {
            audioSupported = true;
        }

        var raptorImageMarkup = '<img id="elRaptor" style="display: none" src="raptor.png" />';
        var raptorAudioMarkup = '<audio id="elRaptorShriek" preload="auto"><source src="raptor-sound.mp3" /><source src="raptor-sound.ogg" /></audio>';    
        var locked = false;

        document.body.insertAdjacentHTML('beforeend', raptorImageMarkup);
        if (audioSupported) {
            document.body.insertAdjacentHTML('beforeend', raptorAudioMarkup);
        }

        var raptor = document.getElementById('elRaptor');
        raptor.style.position = 'fixed';
        raptor.style.bottom = '-700px';
        raptor.style.right = '0';
        raptor.style.display = 'block';

        function init() {
            locked = true;

            if (audioSupported) {
                var raptorShriek = document.getElementById('elRaptorShriek');
                raptorShriek.play();
            }

            raptor.style.transition = 'bottom 0.5s';
            raptor.style.bottom = '0';
            setTimeout(function() {
                raptor.style.transition = 'bottom 0.1s';
                raptor.style.bottom = '-130px';
                setTimeout(function() {
                    var offset = raptor.getBoundingClientRect().left + 400;
                    raptor.style.transition = 'right 2.2s';
                    raptor.style.right = offset + 'px';
                    setTimeout(function() {
                        raptor.style.bottom = '-700px';
                        raptor.style.right = '0';
                        locked = false;
                    }, 2200);
                }, 100);
            }, 500);
        }

        if (options.enterOn === 'timer') {
            setTimeout(init, options.delayTime);
        } else if (options.enterOn === 'click') {
            element.addEventListener('click', function(e) {
                e.preventDefault();
                if (!locked) {
                    init();
                }
            });
        } else if (options.enterOn === 'konami-code') {
            var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
            window.addEventListener('keydown', function(e) {
                kkeys.push(e.keyCode);
                if (kkeys.toString().indexOf(konami) >= 0) {
                    init();
                    window.removeEventListener('keydown', arguments.callee);
                }
            });
        }
    }

    window.raptorize = raptorize;

})();