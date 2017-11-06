<template lang="html">
  <div class="tree-leaf" :class="`tree-leaf-${leafType}`">
    <div class="tree-leaf-gutter">
      <span
        class="tree-view-leaf-toggle"
        :class="{closed: !open}"
        @click="toggle"></span>
    </div>
    <div class="tree-leaf-content">
      <span class="tree-view-leaf-key" v-show="showKey">"{{nodeKey}}"<span class="tree-view-leaf-key-token">:</span></span>
      <tree-leaf-scalar-value :value="value" v-if="isScalar"></tree-leaf-scalar-value>
      <span v-if="isObject" v-show="open">
        <strong>{</strong>
          <div class="tree-leaf-object-block">
            <tree-leaf
              v-for="(v, k) in value"
              :key="k"
              :node-key="k"
              :value="v">
            </tree-leaf>
          </div>
        <strong>}</strong>
      </span>
      <span v-if="isObject && !open" @click="toggle">
        <strong>{</strong> &hellip; <strong>}</strong>
      </span>
      <span v-if="isArray" v-show="open">
        <strong>[</strong>
          <div class="tree-leaf-object-block">
            <tree-leaf
              v-for="(v, k) in value"
              :key="k"
              :node-key="k"
              :value="v">
            </tree-leaf>
          </div>
        <strong>]</strong>
      </span>
      <span v-if="isArray && !open" @click="toggle">
        <strong>[</strong> &hellip; <strong>]</strong>
      </span>
      <span class="tree-leaf-sep">,</span>
      <span
        v-if="comment"
        class="tree-view-comment"
        :data-content="comment"></span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TreeLeafScalarValue from './TreeLeafScalarValue.vue'

export default {
  name: 'tree-leaf',

  components: {
    TreeLeafScalarValue
  },

  props: [
    'nodeKey',
    'value'
  ],

  data () {
    return {
      open: true
    }
  },

  computed: {

    isArray () {
      return _.isArray(this.value)
    },

    isObject () {
      return _.isPlainObject(this.value)
    },

    isScalar () {
      return !this.isArray && !this.isObject
    },

    leafType () {
      if (this.isArray) {
        return 'array'
      }

      if (this.isObject) {
        return 'object'
      }

      if (this.isScalar) {
        return 'scalar'
      }
    },

    showKey () {
      return _.isString(this.nodeKey)
    },

    comment () {
      if (this.isScalar || this.open) {
        return null
      }

      if (this.isArray) {
        let l = this.value.length
        return (l === 1) ? '1 item' : `${l} items`
      }

      if (this.isObject) {
        let l = Object.keys(this.value).length
        return (l === 1) ? '1 item' : `${l} items`
      }
    }
  },

  methods: {
    toggle () {
      if (!this.isValue) {
        this.open = !this.open
      }
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/sass">
.tree-leaf
  position: relative
  display: flex

.tree-leaf-gutter
  width: 2em

.tree-view-leaf-toggle
  display: none
  width: 100%
  height: 1.25em
  justify-content: center
  align-items: center
  cursor: pointer
  &::after
    display: block
    content: ' '
    width: 0
    height: 0
    border-style: solid
    border-width: 8px 4px 0 4px
    border-color: #CCC transparent transparent transparent
  &.closed::after
    transform: rotate(-90deg)

.tree-leaf-object,
.tree-leaf-array
  & > .tree-leaf-gutter > .tree-view-leaf-toggle
    display: flex

.tree-leaf-content
  flex: 1

.tree-leaf > .tree-leaf
  margin-left: 2em

.tree-leaf + .tree-leaf
  margin-top: 0.25em

.tree-view-leaf-key-token


.tree-leaf-object-block
  border-left: 1px dotted #BBB
  margin-left: 2px

.tree-leaf-sep

.tree-leaf:last-child > .tree-leaf-content > .tree-leaf-sep
  display: none

.tree-view-comment
  color: #aaa
  &::before
    content: "// "
  &::after
    content: attr(data-content)

</style>
