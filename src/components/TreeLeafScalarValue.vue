<template lang="html">
  <component
    :is="(type === 'url') ? 'a' : 'span'"
    :href="(type === 'url') ? this.value : null"
    target="_blank"
    class="tree-leaf-scalar-value"
    :class="`tree-leaf-scalar-value-${type}`">
    {{valueLabel}}</component>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import isUrl from 'is-url'

export default {
  props: [
    'value',
    {
      ok: true
    }
  ],

  computed: {
    type () {
      if (_.isNumber(this.value)) {
        return 'number'
      }

      if (_.isBoolean(this.value)) {
        return 'boolean'
      }

      if (_.isDate(this.value)) {
        return 'date'
      }

      if (_.isNull(this.value)) {
        return 'null'
      }

      if (_.isString(this.value)) {
        return (isUrl(this.value)) ? 'url' : 'string'
      }
    },

    valueLabel () {
      if (_.isNull(this.value)) {
        return 'null'
      }

      if (_.isDate(this.value)) {
        return moment(this.value).toISOString()
      }

      if (isUrl(this.value)) {
        return this.value
      }

      if (_.isString(this.value)) {
        return `'${this.value}'`
      }

      return this.value
    }
  }
}
</script>

<style lang="sass" rel="stylesheet/sass">
.tree-leaf-scalar-value
  color: #C077F4

a.tree-leaf-scalar-value
  color: #E51584
  text-decoration: none
  font-weight: bold

.tree-leaf-scalar-value-number,
.tree-leaf-scalar-value-boolean,
.tree-leaf-scalar-value-date,
.tree-leaf-scalar-value-null
  color: #809600
  font-weight: bold

.tree-leaf-scalar-value-string
  color: #00A498

</style>
