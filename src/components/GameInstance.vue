<template>
  <div class="hello">
    <el-row>
      <el-col :span="14">
        <div>
          <canvas class="field" ref="field" id="canvas" width="601" height="301"></canvas>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="text-editor">
          <pre v-html="hlCode" class="hight-window styled-editor"></pre>
          <textarea
            ref="editorText"
            v-model="code"
            type="textarea"
            class="editor styled-editor"
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div>
          <el-input v-model="runFunction" type="text"></el-input>
        </div>
        <div>
          <el-checkbox v-model="resetOnStart" label="Сбрасывать уровень после запуска"></el-checkbox>
          <el-button @click="run">Поехали!</el-button>
        </div>
        <div>
          <h4>Ваше решение:</h4>
          <el-input v-model="gameResult" type="text"></el-input>
        </div>
      </el-col>
    </el-row>
    <level-options></level-options>
    <div></div>

    <div>
      это прога
      вниз
      вправо
      вниз
      влево
      вверх
      конец
    </div>
    <map-editor :game="game"></map-editor>
    <modal-error :msg.sync="error.message"></modal-error>
    <div>
      Icons made by
      <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from
      <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by
      <a
        href="http://creativecommons.org/licenses/by/3.0/"
        title="Creative Commons BY 3.0"
        target="_blank"
      >CC 3.0 BY</a>
    </div>
  </div>
</template>

<script>
import * as sha from 'sha.js';
import ModalError from '@/components/ModalError.vue';
import MapEditor from '@/components/MapEditor.vue';
import LevelOptions from '@/components/LevelOptions.vue';
import Engine from '../lib/engine';
import Direction from '@/lib/engine/direction';
import Func from '@/lib/parser/func';
import Parser from '@/lib/parser/index';
import Executor from '../lib/engine';
import Sprite from '@/lib/parser/sprites/sprite';

export default {
  name: 'GameInstance',
  components: { ModalError, MapEditor, LevelOptions },
  data: () => ({
    msg: '',
    ctx: null,
    gameMap: '',
    startGameMap: '',
    resetOnStart: true,
    code: '',
    runFunction: 'прога',
    game: null,
    gameResult: '',
    isRun: false,
    error: {
      title: '',
      message: '',
    },
    preStyle: null,
  }),

  computed: {
    hlCode: {
      get() {
        const keywords = [
          {
            text: 'это',
            style: 'func',
          },
          {
            text: 'конец',
            style: 'func',
          },
          {
            text: 'если',
            style: 'if',
          },
          {
            text: 'иначе',
            style: 'if',
          },
          {
            text: 'повтори',
            style: 'for',
          },
          {
            text: 'пока',
            style: 'for',
          },
        ];
        let code = this.code;
        for (const keyword of keywords) {
          const rp = new RegExp(keyword.text, 'g');
          code = code.replace(
            rp,
            `<span class="${keyword.style}">${keyword.text}</span>`
          );
        }

        return code;
      },
      set(val) {},
    },
  },

  mounted() {
    this.code = `это прога
если справа стена то
{
  вниз
  вниз
  вниз
}
иначе вправо
конец`;
    const canvas = this.$refs.field;
    this.ctx = canvas.getContext('2d');

    this.game = new Engine(canvas, 0, 0);
    // console.log(this.$refs.editorText.$el);
    // this.preStyle = JSON.parse(
    //   JSON.stringify(getComputedStyle(this.$refs.editorText.$el))
    // );
    // console.log(JSON.parse(JSON.stringify(this.preStyle)));
    this.highlight();
  },

  methods: {
    async run() {
      this.startGameMap = this.game.printMap();
      this.gameMap = JSON.stringify(this.game.printMap());
      const startHash = sha('sha256')
        .update(this.gameMap)
        .digest('hex');
      const parser = new Parser(this.code, this.game);
      parser.parse();
      const func = parser.getFunction(this.runFunction);
      if (func && !this.isRun) {
        this.isRun = true;
        try {
          await func.run();
        } catch (e) {
          this.error.message = e.message;
        }
        this.isRun = false;
        setTimeout(() => {
          if (this.resetOnStart) this.game.readMap(this.startGameMap);
        }, 300);
      }
      this.gameMap = JSON.stringify(this.game.printMap());
      const endHash = sha('sha256')
        .update(this.gameMap)
        .digest('hex');
      this.gameResult = sha('sha256')
        .update(startHash + endHash)
        .digest('hex');
    },

    highlight() {
      this.hlCode = this.code.replace(/это/g, '<span class="func">это</span>');
    },
  },
};
</script>

<style scoped>
.field {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
}
.higlight {
  color: rgba(49, 180, 245, 0.7);
}
.text-editor {
  position: relative;
}
.text-editor pre {
  position: relative;
  left: 0;
  top: 0;
  margin: 0;
}

.styled-editor {
  padding: 10px;
  border: 1px solid gray;
  position: relative;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 400px;
  line-height: 20px;
  outline: none;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
.editor {
  position: absolute;
  left: 0;
  top: 0;
  color: transparent;
  caret-color: black;
  background: transparent;
}
.hight-window {
  margin: 0;
}
</style>


<style>
.func {
  color: orange;
}

.if {
  color: blue;
}

.for {
  color: green;
}
</style>

