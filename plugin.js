(function () {
    'use strict';

    // Офіційний метод реєстрації плагіна в Lampa
    Lampa.Plugins.add('ua_online_plugin', function (api) {
        
        // Функція створення компонента пошуку
        function startPlugin() {
            Lampa.Component.add('ua_online_mod', function (object) {
                var scroll = new Lampa.Scroll({ mask: true, over: true });
                
                this.create = function () {
                    var _this = this;
                    this.activity.loader(true);
                    
                    // Поки що тестовий список, щоб перевірити, чи відкривається вікно
                    setTimeout(function(){
                        _this.activity.loader(false);
                        _this.draw([{title: 'Пошук налаштовується...'}]);
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

            // Додаємо кнопку в картку фільму
            Lampa.Listener.follow('full', function (e) {
                if (e.type == 'complite') {
                    var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                    
                    btn.on('hover:enter', function () {
                        Lampa.Activity.push({
                            url: '',
                            title: 'UA Онлайн',
                            component: 'ua_online_mod',
                            movie: Lampa.Activity.active().card
                        });
                    });
                    
                    if (!$('.view--ua-online').length) {
                        $('.full-start__buttons').append(btn);
                    }
                }
            });

            Lampa.Noty.show('UA Онлайн: АКТИВОВАНО');
        }

        // Запускаємо логіку
        startPlugin();
    });
})();
