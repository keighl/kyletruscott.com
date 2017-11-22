<template>
  <div>
    <div class="tree-wrapper">
      <tree-view :root="root"></tree-view>
    </div>
  </div>
</template>

<script>
import TreeView from './components/TreeView.vue'
import Data from './data.js'

export default {
  name: 'app',
  components: {
    TreeView
  },

  data () {
    return {
      root: Data
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/sass">
@import "style/settings.sass"
@import "style/normalize.css"

body
  background-color: #002C37

.tree-wrapper
  margin: 0 auto
  max-width: 900px

  +tablet
    padding: 2em
  +desktop
    padding: 4em

</style>
