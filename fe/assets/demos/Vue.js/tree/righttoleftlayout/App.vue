<template>
    <JqxTree
        :width="250" :height="350" :source="source" :rtl="true">
    </JqxTree>
</template>

<script>
    import JqxTree from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtree.vue';

    export default {
        components: {
            JqxTree
        },
        data: function () {
            return {
                source:
                [
                    {
                        icon: 'img/mailIcon.png', label: 'Mail', expanded: true,
                        items:
                        [
                            { icon: 'img/calendarIcon.png', label: 'Calendar' },
                            { icon: 'img/contactsIcon.png', label: 'Contacts', selected: true }
                        ]
                    },
                    {
                        icon: 'img/folder.png', label: 'Inbox', expanded: true,
                        items:
                        [
                            { icon: 'img/folder.png', label: 'Admin' },
                            { icon: 'img/folder.png', label: 'Corporate' },
                            { icon: 'img/folder.png', label: 'Finance' },
                            { icon: 'img/folder.png', label: 'Other' },
                        ]
                    },
                    { icon: 'img/recycle.png', label: 'Deleted Items' },
                    { icon: 'img/notesIcon.png', label: 'Notes' },
                    { icon: 'img/settings.png', label: 'Settings', iconsize: 14 },
                    { icon: 'img/favorites.png', label: 'Favorites' },
                ]
            }
        }
    }
</script>