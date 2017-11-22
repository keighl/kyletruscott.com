<template lang="html">
  <div class="tree-view" :class="`tree-view-${theme}`">
    <tree-leaf
      key="root"
      :node-key="null"
      :value="root">
    </tree-leaf>
  </div>
</template>

<script>
import TreeLeaf from './TreeLeaf.vue'

export default {
  components: {
    TreeLeaf
  },

  props: {
    root: {
      type: Object,
      k: null,
      default: {}
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/sass">
@import "../style/settings.sass"

.tree-view
  font-family: 'Hack', monospace
  font-size: 12px
  background-color: #002C37
  color: #7F9596
  -webkit-font-smoothing: antialiased
  border-radius: 4px
  padding: 1em
  line-height: 1.25

  +tablet-up
    font-size: 15px
    padding: 2em
  +desktop
    padding: 3em

</style>
