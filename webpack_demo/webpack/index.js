const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

class Compiler {
  constructor(options) {
    const { entry, output } = options
    this.entry = entry
    this.output = output
    this.graph = []
    this.ID = 0

    this.run(this.entry)
  }
  run(entry) {
    this.generateGraph(entry)
  }

  generateAsset(filename) {
    const content = fs.readFileSync(path.resolve(process.cwd(), filename), 'utf-8')
    const ast = parser.parse(content, { sourceType: 'module' })
    const dependencies = []

    // visitor
    traverse(ast, {
      ImportDeclaration({ node }) {
        dependencies.push(node.source.value)
      },
      VariableDeclaration({ node }) {
        const arg = node.declarations[0].init.arguments
        if (!arg) return
        dependencies.push(node.declarations[0].init.arguments[0].value)
      }
    });

    const { code } = babel.transformFromAstSync(ast, null, {
      presets: ['@babel/preset-env']
    })

    return {
      id: this.ID++,
      filename,
      code,
      dependencies
    }
  }

  generateGraph(entry) {
    this.graph.push(this.generateAsset(entry))
    for (const asset of this.graph) {
      asset.mapping = {}
      asset.dependencies.forEach(src => {
        const child = this.generateAsset(path.join(path.dirname(asset.filename), src))
        asset.mapping[src] = child.id
        this.graph.push(child)
      });
    }
    this.bundle()
  }

  bundle() {
    let modules = ''
    this.graph.forEach(mod => {
      modules += `
      ${mod.id}: [
        function (require, module, exports) {
          ${mod.code}
        },
        ${JSON.stringify(mod.mapping)}
      ],
    `
    })

    const bundleCode = `
  !function(modules) {
    function require(id) {
      const [fn, mapping] = modules[id]

      function localRequire(relativePath) {
          return require(mapping[relativePath])
      }

      const module = {
        exports: {}
      }

      fn(localRequire, module, module.exports)

      return module.exports
    }
    
    require(0)
  }({${modules}})
`
    if (!fs.existsSync(path.resolve(process.cwd(), this.output.path))) {
      fs.mkdirSync(path.resolve(process.cwd(), this.output.path))
    }

    fs.writeFileSync(path.resolve(process.cwd(), this.output.path, this.output.filename), bundleCode)

  }
}


const config = require(path.resolve(process.cwd(), './config.js'))

new Compiler(config)
