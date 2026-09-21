<template>
    <div style="float: left;">
        <JqxMenu :source="source"
                 :mode="'vertical'"
                 :width="180"
                 :height="180">
        </JqxMenu>
    </div>
</template>
<script>
    import JqxMenu from "jqwidgets-scripts/jqwidgets-vue/vue_jqxmenu.vue"

    export default {
        components: {
            JqxMenu
        },
        data: function () {
            return {
                source: [
                    {
                        html: "<img src='img/mailIcon.png'/><span style='position: relative; left: 3px; top: -2px;'>Mail</span>",
                        items: [
                            { html: "<img src='img/calendarIcon.png'/><span style='position: relative; left: 3px; top: -2px;'>Calendar</span>" },
                            { html: "<img src='img/contactsIcon.png'/><span style='position: relative; left: 3px; top: -2px;'>Contacts</span>" }
                        ]
                    },
                    {
                        html: "<img src='img/folder.png'/><span style='position: relative; left: 3px; top: -2px;'>Inbox</span>",
                        items: [
                            { html: "<img src='img/folder.png'/><span style='position: relative; left: 3px; top: -2px;'>Admin</span>" },
                            { html: "<img src='img/folder.png'/><span style='position: relative; left: 3px; top: -2px;'>Corporate</span>" },
                            { html: "<img src='img/folder.png'/><span style='position: relative; left: 3px; top: -2px;'>Finance</span>" },
                            { html: "<img src='img/folder.png'/><span style='position: relative; left: 3px; top: -2px;'>Other</span>" }]
                    },
                    { html: "<img src='img/recycle.png'/><span style='position: relative; left: 3px; top: -2px;'>Deleted Items</span>" },
                    { html: "<img src='img/notesIcon.png'/><span style='position: relative; left: 3px; top: -2px;'>Notes</span>" },
                    { html: "<img src='img/settings.png'/><span style='position: relative; left: 3px; top: -2px;'>Settings</span>" },
                    { html: "<img src='img/favorites.png'/><span style='position: relative; left: 3px; top: -2px;'>Favorites</span>" }
                ]
            }
        }
    }
</script>

<style>
</style>
