<template>
  <div>
    <div id="editor">

    </div>
  </div>
</template>

<script>
import Editor from "wangeditor"
import "wangeditor/release/wangEditor.min.css"
export default {
  mounted () {
    let editor = new Editor("#editor")
    editor.customConfig.onchange = html => {
      this.$emit('editorChange', html, editor.txt.text())
    }
    editor.create()
  }
}
</script>

<style scoped>
</style>
