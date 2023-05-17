module.exports = {
  seleccionarSkills: ( seleccionadas = [], opciones) => {
    const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];
    
    let html = '';
    skills.forEach( item => {
      html += `
        <li ${seleccionadas.includes(item) ? 'class="activo"' : ''}>${item}</li>
      `
    })
    return opciones.fn().html = html
  },
  tipoContrato : (seleccionado, opciones) => {
    return opciones.fn(this).replace(
      new RegExp(`value="${seleccionado}"`), '$& selected="selected"'
    )
  }
}