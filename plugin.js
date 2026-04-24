(function () {
    'use strict';

    function startPlugin() {
        console.log('UA Online Plugin: Init start');

        // Реєстрація компонента
        Lampa.Component.add('ua_online_mod', function (object) {
            var network = new Lampa.Reguest();
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            var items = [];
            
            this.create = function () {
                var _this = this;
                this.activity.loader(true);
                
                // Для тесту - просто виведемо щось у список
                setTimeout(function(){
                    _this.activity.loader(false);
                    _this.draw([{title: 'Перевірка з'єднань...'}]);
                }, 500);

                return scroll.render();
            };

            this.draw = function(data) {
                scroll.clear();
                data.forEach(function(item) {
                    var card = Lampa.Template.get('button', { title: item.title });
                    scroll.append(card);
                });
            };
        });

        // Функція додавання кнопки
        var addEntry = function() {
            if ($('.full-start__buttons').length && !$('.view--ua-online').length) {
                var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                
                btn.on('hover:enter', function () {
                    Lampa.Activity.push({
                        url: '',
                        title: 'UA Онлайн',
                        component: 'ua_online_mod',
                        movie: Lampa.Activity.active().card
                    });
                });
                
                $('.full-start__buttons').append(btn);
            }
        };

        // Слухаємо відкриття картки фільму
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                addEntry();
            }
        });

        // Повідомлення для перевірки
        Lampa.Noty.show('UA Онлайн: ПЛАГІН АКТИВОВАНО');
    }

    // Спроба миттєвого запуску
    try {
        startPlugin();
    } catch (e) {
        console.error('UA Online Plugin Error:', e);
    }

})();
