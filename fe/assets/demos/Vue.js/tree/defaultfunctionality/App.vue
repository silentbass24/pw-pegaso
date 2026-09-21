<template>
    <div>
        <JqxExpander 
            :width="300" :height="370" :showArrow="false" :toggleMode="'none'">
            <div>Folders</div>
            <div style="overflow: hidden;">
                <JqxTree ref="myTree"
                    :width="'100%'" :height="'100%'" :source="treeSource">
                </JqxTree>
            </div>
        </JqxExpander>
    </div>
</template>

<script>
    import JqxTree from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxtree.vue';
    import JqxExpander from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxexpander.vue';

    export default {
        components: {
            JqxTree,
            JqxExpander
        },
        data: function () {
            return {
                treeSource:
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
                    { icon: 'img/favorites.png', label: 'Favorites' }
                ]
            }
        },
        mounted: function () {
            this.$refs.myTree.selectItem(null);
        }
    }
</script>