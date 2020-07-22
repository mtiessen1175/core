<sorting-tab v-cloak :volume-id="volumeId" :file-ids="fileIds" v-on:loading="toggleLoading" v-on:update="updateSortingSequence" inline-template>
    <div class="sorting-tab">
        <div class="sorting-tab__buttons">
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-default" title="Sort ascending" :class="{active: isSortedAscending}" v-on:click="sortAscending"><span class="fa fa-sort-amount-up" aria-hidden="true"></span></button>
                <button type="button" class="btn btn-default" title="Sort descending" :class="{active: isSortedDescending}" v-on:click="sortDescending"><span class="fa fa-sort-amount-down" aria-hidden="true"></span></button>
            </div>
            <div class="btn-group pull-right" role="group">
                <button type="button" class="btn btn-default" title="Reset sorting" v-on:click="reset"><span class="fa fa-times" aria-hidden="true"></span></button>
            </div>
        </div>

        <div class="list-group sorter-list-group">
            <component :is="sorter.component" :active-sorter="activeSorter" v-on:select="handleSelect" v-for="sorter in sorters" :key="sorter.id"></component>
        </div>
    </div>
</sorting-tab>
