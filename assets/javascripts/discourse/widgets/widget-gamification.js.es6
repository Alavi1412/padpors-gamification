import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { avatarImg } from 'discourse/widgets/post';
import { ajax } from 'discourse/lib/ajax';
import { popupAjaxError } from 'discourse/lib/ajax-error';




export default createWidget('widget-gamification', {
    tagName: 'div.widget-gamification.widget-container',
    buildKey: (attrs) => 'widget-gamification',

    defaultState(attrs) {
        return {
            topic: attrs.topic,
            loaded: false,
            contents: [],
            trust_level: 0,
            user_name: "It is Undefined",
            user_id: 0
        }
    },

    zeroTrustLevel(){
        let self = this;
        ajax(`/gamification/Xd5TwdgW.json?user_id=${self.state.user_id}`).then(function(res) {
            var first_like_received = false, first_like_gived = false;
            let badges = res.badges;
            let temp = [];
            for(var i = 0 ; i < badges.length ; i++)
            {
                if(badges[i].badge_id == 5)
                    first_like_received = true;
                else if (badges[i].badge_id == 11)
                    first_like_gived = true;
            }

            if (first_like_gived)
                temp.push(h("i.fa.fa-heart-o",{attributes:{"aria-hidden" : true, title: I18n.t("main.done")}}));
            else
                temp.push(h("i.fa.fa-heart-o.nobadge",{attributes:{title: I18n.t("main.no-gived-like"),"aria-hidden" : true}}));

            if (first_like_received) 
                temp.push(h("i.fa.fa-heart",{attributes:{"aria-hidden" : true, title: I18n.t("main.done")}}));
            else
                temp.push(h("i.fa.fa-heart.nobadge",{attributes:{title: I18n.t("main.no-received-like"),"aria-hidden" : true}}));
            var readTime = 0, enteredTopic = 0, replyRead = 0;
            if(res.stats.time_read*100/(13*60) > 99)
                readTime = 100;
            else
                readTime = res.stats.time_read*100/(13*60);

            if (res.stats.topics_entered*100/7 > 99)
                enteredTopic = 100;
            else
                enteredTopic = res.stats.topics_entered*100/7;

            if(res.stats.posts_read_count*100/30 > 99)
                replyRead = 100;
            else
                replyRead = res.stats.posts_read_count*100/30;
            self.state.contents.push(h("span.welcome-widget",{attributes:{title:I18n.t(`main.welcome-title0-tooltip`)}},I18n.t(`main.welcome-title0`)));
            self.state.contents.push(h("div.block-widget", [
                h("h1.header-widget",{attributes:{title:I18n.t("main.reading-level-tooltip")}}, I18n.t("main.reading-level")),
                [
                h("div.block-widget.enterd-topic-block",[
                    h("span.title",h("span",I18n.t("main.enterd-topic"))),
                    h("div.w3-border",[h("div.w3-grey.enterd-topic-progress",{attributes: {style: `height:20px;width:${enteredTopic}%`}},h("span", res.stats.topics_entered))])
                    ]),
                h("div.block-widget.reply-read-block",[
                    h("span.title",h("span",I18n.t("main.reply-read"))),
                    h("div.w3-border",[h("div.w3-grey.reply-read-progress",{attributes: {style: `height:20px;width:${replyRead}%`}},h("span",res.stats.posts_read_count))]),
                    ]),
                h("div.block-widget.read-time-block",[
                    h("span.title",h("span",I18n.t("main.read-time"))),
                    h("div.w3-border",[h("div.w3-grey.read-time-progress",{attributes: {style: `height:20px;width:${readTime}%`}},h("span",res.stats.time_read + "s"))])
                    ])
                ],
                h("div.badge-div",[h("span.title",{attributes: {title: I18n.t("main.next-badge-tooltip")}},I18n.t("main.next-badge") ),temp]),
                h("span.hint", res.hint),
                h("a.zero-bishtar",{attributes:{title: I18n.t("main.bishtar-bedanit0-tooltip"),href: "https://padpors.com/t/اعتبار-اولیه-در-پادپُرس-به-چه-صورت-کسب-می‌شود؟/4906?u=padpors"}},I18n.t("main.bishtar-bedanit0"))

                ]));
            self.scheduleRerender();
        });
    },
    askAnalys(res){
        let self = this;
        if (res.todo == "name") {
            return h("div#namediv",[h("h1.header-widget", {attributes:{title: I18n.t("main.more-tooltip")}}, I18n.t("main.more-game")),
                h("span.title", {attributes:{title: I18n.t("main.name-tooltip")}}, I18n.t("main.enter-your-name")),
                h("input#name",{attributes:{type: "text"}}),
                h("button.btn#submitname", I18n.t("main.save-it"))
                ]);
        }
        else if (res.todo == "date_of_birth") {
            let tempDay = [];
            let tempYear = [];
            var d = new Date();
            var n = d.getFullYear();
            for (var i = 1; i < 32; i++) {
                tempDay.push(h("option",{attributes:{value: `${i}`}}, i));
            }
            for (var i = n; i >= 1930 ; i--) {
                tempYear.push(h("option",{attributes:{value: `${i}`}}, i));
            }
            return h("div#birthdiv.birthdiv",[h("h1.header-widget", {attributes:{title: I18n.t("main.more-tooltip")}}, I18n.t("main.more-game")),
                h("span.title",{attributes:{title: I18n.t("main.birthday-tooltip")}}, I18n.t("main.date-of-birth")),
                h("select#year", tempYear),
                h("select#month",[
                    h("option",{attributes:{value: "january"}}, I18n.t("main.january")),
                    h("option",{attributes:{value: "february"}}, I18n.t("main.february")),
                    h("option",{attributes:{value: "march"}}, I18n.t("main.march")),
                    h("option",{attributes:{value: "april"}}, I18n.t("main.april")),
                    h("option",{attributes:{value: "may"}}, I18n.t("main.may")),
                    h("option",{attributes:{value: "june"}}, I18n.t("main.june")),
                    h("option",{attributes:{value: "july"}}, I18n.t("main.july")),
                    h("option",{attributes:{value: "agust"}}, I18n.t("main.agust")),
                    h("option",{attributes:{value: "september"}}, I18n.t("main.september")),
                    h("option",{attributes:{value: "october"}}, I18n.t("main.october")),
                    h("option",{attributes:{value: "novamber"}}, I18n.t("main.novamber")),
                    h("option",{attributes:{value: "december"}}, I18n.t("main.december"))]),
                h("select#day",tempDay),h("button.btn#submitbirth", I18n.t("main.save-it"))
                ]);
        }
        else if (res.todo == "expertis"){
            return h("div#expertisdiv",[h("h1.header-widget", {attributes:{title: I18n.t("main.more-tooltip")}}, I18n.t("main.more-game")),
                h("span.title",{attributes:{title: I18n.t("main.expert-tooltip")}}, I18n.t("main.expertis")),
                h("input#expertis", {attributes: {type: "text"}}),
                h("button.btn#submitexpertis", I18n.t("main.save-it"))
                ]);
        }
        else if (res.todo == "avatar") {
            return h("div#avatardiv",[h("h1.header-widget", {attributes:{title: I18n.t("main.more-tooltip")}}, I18n.t("main.more-game")),
                h("span.title",{attributes:{title: I18n.t("main.avatar-tooltip-gamification")}}, I18n.t("main.avatar")),
                h("a.btn.setAvatar", {attributes: {href: `/u/${self.state.user_name}/preferences`}}, I18n.t("main.setting-gamification"))
                ]);
        }
        else if (res.todo == "location") {
            return h("div#locationdiv", [h("h1.header-widget", {attributes:{title: I18n.t("main.more-tooltip")}}, I18n.t("main.more-game")),
                h("span.title",{attributes:{title: I18n.t("main.location-tooltip")}}, I18n.t("main.location")),
                h("input#location", {attributes: {type: "text"}}),
                h("button.btn#submitloaction", I18n.t("main.save-it"))
                ]);
        }
        else if (res.todo == "status") {
            var score = 0;
            if (res.status.total_like_count < 10)
                        score = 10;
                    else
                        score = res.status.total_like_count;
            return [h("div.block-widget",h("h1.header-widget", {attributes:{title: I18n.t("main.data-tooltip")}}, I18n.t("main.data-game"))),h("div.bar-chart-widget", [
                    h("div.mosharekat-border",h("div.w3-grey.mosharekat",{attributes: {title: score, style: `height:20px;width:${score*100/res.status.top_user}%`}},I18n.t("main.mosharekat"))),

                    h("div.mosharekat-border",h("div.w3-grey.mosharekat-mean",{attributes: {title: res.status.norm, style: `height:20px;width:${(res.status.norm*100)/res.status.top_user}%`}},I18n.t("main.mosharekat-ave"))),

                    h("div.mosharekat-border",h("div.w3-grey.mosharekat-top",{attributes: {title: res.status.top_user, style: `height:20px;width:100%`}}, I18n.t("main.mosharekat-top")))

                    ]),h("a.one-bishtar",{attributes:{title: I18n.t("main.bishtar-bedanit1-tooltip"),href: "https://padpors.com/t/%D8%A8%D8%A7%D8%B2%D8%AF%D9%87%DB%8C-%DB%8C%DA%A9-%DA%A9%D8%A7%D8%B1%D8%A8%D8%B1-%D9%85%D8%B9%D8%AA%D8%A8%D8%B1-%DA%86%DB%8C%D8%B3%D8%AA-%D9%88-%DA%86%DA%AF%D9%88%D9%86%D9%87-%D8%A7%D9%86%D8%AF%D8%A7%D8%B2%D9%87-%DA%AF%DB%8C%D8%B1%DB%8C-%D9%85%DB%8C%E2%80%8C%D8%B4%D9%88%D8%AF%D8%9F/4907?u=padpors"}},I18n.t("main.bishtar-bedanit1"))
                   ]
        }
    },
    oneTrustLevel(){
        let self = this;
        ajax(`/gamification/te2Fgd5XvAZ.json?user_id=${self.state.user_id}`).then(function (res){
            if (res.no_badge)
                self.zeroTrustLevel();
            else if (res.state){
                var result = self.askAnalys(res);
                if (!res.no_badge)
                    self.state.contents.push(
                        result,
                        h("span.hint", res.hint)
                        );
            }
            else{
                self.state.contents.push(h("h1.header-widget", {attributes:{title: I18n.t("main.more-tooltip")}}, I18n.t("main.more-game")));
                self.state.contents.push(h("span.title",{attributes:{title: I18n.t("main.personality-tooltip")}}, I18n.t("main.I-am-more")));

                self.state.contents.push(h("button.btn#montaghed", I18n.t("main.montaghed")));
                self.state.contents.push(h("button.btn#moshahedegar", I18n.t("main.moshahedegar")));
                self.state.contents.push(h("button.btn#porseshgar", I18n.t("main.porseshgar")));
                self.state.contents.push(h("button.btn#idepardaz", I18n.t("main.idepardaz")));
            }
            self.scheduleRerender();
        });
    },
    twoTrustLevel(){
        let self = this;
        ajax(`/gamification/Xz54dw5fGwe4g5.json?user_id=${self.state.user_id}`).then(function(res){
            if (res.state == false){
                if (res.todo) {
                    var result = self.askAnalys(res);
                    self.state.contents.push(
                        result
                        );
                }
                else{
                    self.state.contents.push(h("h1.header-widget", {attributes:{title: I18n.t("main.more-tooltip")}}, I18n.t("main.more-game")));
                    self.state.contents.push(h("span.title", {attributes:{title: I18n.t("main.personality-tooltip")}}, I18n.t("main.I-am-more")));

                    self.state.contents.push(h("button.btn#montaghed", I18n.t("main.montaghed")));
                    self.state.contents.push(h("button.btn#moshahedegar", I18n.t("main.moshahedegar")));
                    self.state.contents.push(h("button.btn#porseshgar", I18n.t("main.porseshgar")));
                    self.state.contents.push(h("button.btn#idepardaz", I18n.t("main.idepardaz")));
                }
            }
            else{
                if (res.is_top_user == false) {
                    var score = 0;
                    if (res.total_like_count < 10)
                        score = 10;
                    else
                        score = res.total_like_count;
                    self.state.contents.push(h("div.widget-block",[h("h1.header-widget", {attributes:{title: I18n.t("main.data-tooltip")}}, I18n.t("main.data-game")),
                        h("div.bar-chart-widget", [
                    h("div.mosharekat-border",h("div.w3-grey.mosharekat.progress",{attributes: {title: score, style: `height:20px;width:${score*100/res.top_user}%`}}, I18n.t("main.mosharekat"))),

                    h("div.mosharekat-border",h("div.w3-grey.mosharekat-mean",{attributes: {title: res.norm, style: `height:20px;width:${(res.norm*100)/res.top_user}%`}}, I18n.t("main.mosharekat-ave"))),

                    h("div.mosharekat-border",h("div.w3-grey.mosharekat-top",{attributes: {title: res.top_user, style: `height:20px;width:100%`}},I18n.t("main.mosharekat-top")))

                    ]),h("a.two-bishtar",{attributes:{title: I18n.t("main.bishtar-bedanit1-tooltip"),href: "https://padpors.com/t/%D8%A8%D8%A7%D8%B2%D8%AF%D9%87%DB%8C-%DB%8C%DA%A9-%DA%A9%D8%A7%D8%B1%D8%A8%D8%B1-%D9%85%D8%B9%D8%AA%D8%A8%D8%B1-%DA%86%DB%8C%D8%B3%D8%AA-%D9%88-%DA%86%DA%AF%D9%88%D9%86%D9%87-%D8%A7%D9%86%D8%AF%D8%A7%D8%B2%D9%87-%DA%AF%DB%8C%D8%B1%DB%8C-%D9%85%DB%8C%E2%80%8C%D8%B4%D9%88%D8%AF%D8%9F/4907?u=padpors"}},I18n.t("main.bishtar-bedanit1"))]));
                }
                else{
                    self.state.contents = [];
                    // self.state.contents.push(
                    //     h("div.block-widget", [
                    // h("div.top-border",h("div.w3-grey.good-answer",{attributes: {title: res.good_answer, style: `height:20px;width:${res.good_answer*10}%`}}, I18n.t("main.good-answer"))),

                    // h("div.top-border",h("div.w3-grey.good-question",{attributes: {title: res.good_question,style: `height:20px;width:${res.good_question*10}%`}}, I18n.t("main.good-question"))),

                    // h("div.top-border",h("div.w3-grey.efficient",{attributes: {title: res.efficient, style: `height:20px;width:${res.efficient*10}%`}}, I18n.t("main.efficient"))),

                    // h("div.testClass",h("div.testClass2"))

                    // ]));
                }

            }

            self.scheduleRerender();
        });
    },
    getUserInfo(){
        const {currentUser} = this;
        let self = this;
        self.state.loaded = true;
        self.state.user_name = currentUser.get("username");
        self.state.user_id = Discourse.User.currentProp('id');
        self.state.trust_level = currentUser.get('trust_level');
        if (self.state.trust_level == 0)
            this.zeroTrustLevel();
        else if (self.state.trust_level == 1)
            this.oneTrustLevel();
        else if (self.state.trust_level == 2)
            this.twoTrustLevel();
    },

    html(attrs, state) {
        const {currentUser} = this;
        const topic = state.topic;
        
        var log = "unloged-user";
        if (currentUser && !topic)
        {
            log = "loged-user";
                if (state.loaded == false)
                {
                    this.getUserInfo();
                }
        }
        return h(`div.widget-inner.${log}`, state.contents);
    },

    click(e){
        let self = this;
        console.log(e);
        if (e.target.localName != "button" && e.target.localName != "i")
            return;
        var id = e.target.id;
        if (id == "montaghed" || id == "moshahedegar" || id == "porseshgar" || id == "idepardaz"){
            var string = "";
            if (id == "montaghed")
                string = "منتقد";
            else if (id == "moshahedegar")
                string = "مشاهده‌گر";
            else if (id == "porseshgar")
                string = "پرسش‌گر";
            else if (id == "idepardaz")
                string = "ایده‌پرداز";
            ajax(`/gamification/chaDgoeAg5sSaG?personality=${string}&user_id=${self.state.user_id}`).then(function(res){
                self.state.loaded = false;
                self.state.contents = [];
                self.scheduleRerender();
            });
        }
        else if (id == "submitname") {
            ajax(`/gamification/cQ5sdGr2eFGfsF2?user_id=${self.state.user_id}&name=${e.target.parentElement.childNodes[2].value}`).then(function(res){
                self.state.loaded = false;
                self.state.contents = [];
                self.scheduleRerender();
            });
        }
        else if (id == "submitbirth") {
            var day = e.target.parentElement.childNodes[4].value;
            var month = e.target.parentElement.childNodes[3].value;
            var year = e.target.parentElement.childNodes[2].value;
            var monthNum = 0;
            if (month == "january")
                monthNum = 1;
            else if (month == "february")
                monthNum = 2;
            else if (month == "march")
                monthNum = 3;
            else if (month == "april")
                monthNum = 4;
            else if (month == "may")
                monthNum = 5;
            else if (month == "june")
                monthNum = 6;
            else if (month == "july")
                monthNum = 7;
            else if (month == "agust")
                monthNum = 8;
            else if (month == "september")
                monthNum = 9;
            else if (month == "october")
                monthNum = 10;
            else if (month == "novamber")
                monthNum = 11;
            else if (month == "december")
                monthNum = 12;

            ajax(`/gamification/AsdGEgDvBNAgWOFKASF?user_id=${self.state.user_id}&birth=${year}-${monthNum}-${day}`).then(function (res){
                self.state.loaded = false;
                self.state.contents = [];
                self.scheduleRerender();
            });
        }
        else if (id == "submitexpertis") {
            ajax(`/gamification/sdv43GSDGr34ZxasfEw?user_id=${self.state.user_id}&expertis=${e.target.parentElement.childNodes[2].value}`).then(function(res){
                self.state.loaded = false;
                self.state.contents = [];
                self.scheduleRerender();
            });
        }
        else if (id == "submitloaction") {
            ajax(`/gamification/csAfGE45fSe56XZvsdf4g?user_id=${self.state.user_id}&location=${e.target.parentElement.childNodes[2].value}`).then(function(res) {
                self.state.loaded = false;
                self.state.contents = [];
                self.scheduleRerender();
            });
        }
    }

});
