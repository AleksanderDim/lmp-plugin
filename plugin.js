(function () {
    'use strict';

    function startPlugin() {
        // --- ПОВНИЙ СПИСОК ДЖЕРЕЛ (ОНОВЛЕНО) ---
        var sources = [
            { name: 'Anitube', url: 'https://anitube.in.ua/index.php?do=search', type: 'dle' },
            { name: 'Anihub', url: 'https://anihub.in.ua/index.php?do=search', type: 'dle' },
            { name: 'AnimeUA Club', url: 'https://animeua.club/index.php?do=search', type: 'dle' },
            { name: 'Amanogawa', url: 'https://amanogawa.space/index.php?do=search', type: 'dle' },
            { name: 'UAFix', url: 'https://uafix.net/index.php?do=search', type: 'dle' },
            { name: 'Hikka', url: 'https://hikka.io/index.php?do=search', type: 'dle' },
            { name: 'AnimeOn', url: 'https://animeon.club/index.php?do=search', type: 'dle' },
            { name: 'UAKino', url: 'https://uakino.cx/index.php?do=search', type: 'dle' },
            { name: 'Uaserials', url: 'https://uaserials.my/index.php?do=search', type: 'dle' },
            { name: 'Rezka UA (Pub)', url: 'https://rezka-ua.pub/index.php?do=search', type: 'dle' },
            { name: 'HDRezka (Blacklist)', url: 'https://blacklist-hdrezka-ua.net/index.php?do=search', type: 'dle' },
            { name: 'Ashdi API', url: 'https://ashdi.vip/api/video/search?title={title}', type: 'json_api' }
        ];

        Lampa.Component.add('my_custom_online', function (object) {
            var network = new Lampa.Reguest();
            var scroll = new Lampa.Scroll({ mask: true, over: true });
            var files = new Lampa.Explorer(object);
            var searchTitle = object.movie.title || object.movie.name;
            
            this.create = function () {
                var _this = this;
                this.activity.loader(true);
                this.search(searchTitle);
                return scroll.render();
            };

            this.search = function (title) {
                var _this = this;
                var results = [];
                var completed = 0;

                sources.forEach(function (source) {
                    if (source.type === 'dle') {
                        // Універсальний пошук для DLE-сайтів
                        var postData = { do: 'search', subaction: 'search', search_start: 1, full_search: 0, result_from: 1, story: title };

                        network.native(source.url, function (html) {
                            // Шукаємо посилання на сторінку фільму/серіалу
                            var linkMatch = html.match(/href="(https?:\/\/[^"]+\d+-[^"]+\.html)"/i);
                            
                            if (linkMatch && linkMatch[1]) {
                                results.push({
                                    title: title + ' [' + source.name + ']',
                                    url: linkMatch[1],
                                    quality: 'Знайдено'
                                });
                            }
                            checkComplete();
                        }, checkComplete, postData, { dataType: 'text' });

                    } else if (source.type === 'json_api') {
                        var fetchUrl = source.url.replace('{title}', encodeURIComponent(title));
                        network.native(fetchUrl, function (data) {
                            var items = (typeof data === 'string') ? JSON.parse(data) : data;
                            if (items && items.length) {
                                items.forEach(function(item) {
                                    results.push({ 
                                        title: item.title + ' [Ashdi]', 
                                        url: item.url, 
                                        quality: item.quality || '720p' 
                                    });
                                });
                            }
                            checkComplete();
                        }, checkComplete);
                    }
                });

                function checkComplete() {
                    completed++;
                    if (completed === sources.length) _this.buildList(results);
                }
            };

            this.buildList = function (results) {
                var _this = this;
                this.activity.loader(false);
                scroll.clear();

                if (results.length > 0) {
                    results.forEach(function (item) {
                        var file = Lampa.Template.get('button', { title: item.title, description: item.quality });
                        file.on('hover:enter', function () {
                            Lampa.Player.play({ url: item.url, title: item.title });
                            Lampa.Player.playlist([item]);
                        });
                        scroll.append(file);
                    });
                } else {
                    scroll.append(Lampa.Template.get('list_empty', { 
                        title: 'Нічого не знайдено', 
                        text: 'Спробуйте іншу назву (бажано українською)' 
                    }));
                }
            };
        });

        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                var btn = '<div class="full-start__button selector view--online" data-action="my_custom_online"><span>UA Онлайн</span></div>';
                $('.full-start__buttons').append(btn);
            }
        });
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') startPlugin(); });
})();
