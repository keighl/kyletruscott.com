<template lang="html">
  <div class="tree-view">
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
  background: #FFF
  -webkit-font-smoothing: antialiased
  border: 1px #eaeaea solid
  box-shadow: 0 2px 6px rgba(#000, 0.05)
  border-radius: 4px
  padding: 1em

  +tablet-up
    font-size: 13px
    padding: 2em
  +desktop
    padding: 3em

</style>
