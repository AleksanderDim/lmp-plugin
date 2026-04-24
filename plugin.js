(function () {
    'use strict';

    function startPlugin() {
        // Конфігурація джерел
        var sources = [
            { name: 'Anitube', url: 'https://anitube.in.ua/index.php?do=search', type: 'dle' },
            { name: 'UAKino', url: 'https://uakino.cx/index.php?do=search', type: 'dle' },
            { name: 'Uaserials', url: 'https://uaserials.my/index.php?do=search', type: 'dle' },
            { name: 'Ashdi API', url: 'https://ashdi.vip/api/video/search?title={title}', type: 'json_api' }
        ];

        // Додаємо компонент у систему Lampa
        Lampa.Component.add('my_custom_online', function (object) {
            var network = new Lampa.Reguest();
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            var files = new Lampa.Explorer(object);
            var searchTitle = object.movie.title || object.movie.name;
            
            this.create = function () {
                var _this = this;
                this.activity.loader(true);
                
                var completed = 0;
                var results = [];

                sources.forEach(function (source) {
                    var url = source.url.replace('{title}', encodeURIComponent(searchTitle));
                    var postData = source.type === 'dle' ? { do: 'search', subaction: 'search', search_start: 1, full_search: 0, result_from: 1, story: searchTitle } : null;

                    network.native(url, function (data) {
                        if (source.type === 'dle') {
                            var linkMatch = data.match(/href="(https?:\/\/[^"]+\d+-[^"]+\.html)"/i);
                            if (linkMatch) results.push({ title: searchTitle + ' [' + source.name + ']', url: linkMatch[1] });
                        } else {
                            var items = typeof data === 'string' ? JSON.parse(data) : data;
                            if (items && items.length) items.forEach(function(i){ results.push({ title: i.title + ' [Ashdi]', url: i.url }); });
                        }
                        check();
                    }, check, postData, { dataType: 'text' });
                });

                function check() {
                    completed++;
                    if (completed === sources.length) {
                        _this.activity.loader(false);
                        _this.draw(results);
                    }
                }

                return scroll.render();
            };

            this.draw = function(items) {
                scroll.clear();
                if (items.length) {
                    items.forEach(function(item) {
                        var card = Lampa.Template.get('button', { title: item.title });
                        card.on('hover:enter', function() {
                            Lampa.Player.play({ url: item.url, title: item.title });
                        });
                        scroll.append(card);
                    });
                } else {
                    scroll.append(Lampa.Template.get('list_empty'));
                }
            };
        });

        // Створюємо кнопку в картці
        function addBtn() {
            if ($('.full-start__buttons').length && !$('.view--my-online').length) {
                var btn = $('<div class="full-start__button selector view--my-online"><span>UA Онлайн</span></div>');
                btn.on('hover:enter', function () {
                    Lampa.Activity.push({
                        url: '',
                        title: 'UA Онлайн',
                        component: 'my_custom_online',
                        movie: Lampa.Activity.active().card
                    });
                });
                $('.full-start__buttons').append(btn);
            }
        }

        // Запуск перевірки появи кнопок
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'complite') addBtn();
        });
        
        // Повідомлення про успішне завантаження плагіна (для тесту)
        Lampa.Noty.show('Плагін UA Онлайн завантажено!');
    }

    // Реєстрація плагіна в Lampa
    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') startPlugin(); });

})();
