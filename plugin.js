(function () {
    'use strict';

    function startPlugin() {
        // Реєструємо компонент, який буде показувати список озвучок
        Lampa.Component.add('ua_online_mod', function (object) {
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            
            this.create = function () {
                var _this = this;
                this.activity.loader(true);
                
                // Тестовий список джерел
                setTimeout(function(){
                    _this.activity.loader(false);
                    var results = [
                        {title: 'UA: Anitube', url: 'https://anitube.in.ua/'},
                        {title: 'UA: UAKino', url: 'https://uakino.cx/'},
                        {title: 'UA: Ashdi', url: 'https://ashdi.vip/'}
                    ];
                    _this.draw(results);
                }, 800);

                return scroll.render();
            };

            this.draw = function(data) {
                scroll.clear();
                var _this = this;
                data.forEach(function(item) {
                    var card = Lampa.Template.get('button', { title: item.title });
                    card.on('hover:enter', function() {
                        Lampa.Noty.show('Запуск пошуку на ' + item.title);
                    });
                    scroll.append(card);
                });
            };
        });

        // ПРАВИЛЬНИЙ МЕТОД ДЛЯ ОРИГІНАЛЬНОЇ LAMPA:
        // Слухаємо подію відкриття картки і додаємо кнопку через вбудований метод
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') {
                var btn = $('<div class="full-start__button selector view--ua-online"><span>UA Онлайн</span></div>');
                
                btn.on('hover:enter', function () {
                    Lampa.Activity.push({
                        url: '',
                        title: 'UA Онлайн',
                        component: 'ua_online_mod',
                        movie: e.data.movie,
                        page: 1
                    });
                });

                // В оригінальній Лампі ми шукаємо саме цей блок
                var container = e.object.render().find('.full-start__buttons');
                if (container.length && !container.find('.view--ua-online').length) {
                    container.append(btn);
                    // Важливо для ядра: оновлюємо навігацію конкретного об'єкта
                    e.object.navigation(); 
                }
            }
        });

        Lampa.Noty.show('UA-Plugin: Інтегровано в ядро!');
    }

    // Офіційний запуск
    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') startPlugin(); });
})();
