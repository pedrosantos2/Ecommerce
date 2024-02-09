import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from 'axios'
import { withSwal } from "react-sweetalert2";


function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null)
  const [name, setName] = useState('')
  const [parentCategory, setParentCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [properties, setProperties] = useState([])
  useEffect(() => {
    fetchCategories()
  }, [])
  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data)
    })
  }
  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { name, parentCategory, properties:properties.map(p => ({name:p.name,value:p.value.split(',')}))}
    if (editedCategory) {
      data._id = editedCategory._id
      await axios.put('/api/categories', data)
      setEditedCategory(null)
    } else {
      await axios.post('/api/categories', data)
    }
    setName('')
    setParentCategory('')
    setProperties('')
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category)
    setName(category.name)
    setParentCategory(category.parent?._id)
    setProperties(category.properties.map(({name,value}) => ({
      name,
      value:value.join(',')
    }))
    )
  }

  function deleteCategory(category) {
    swal.fire({
      title: "Tem Certeza?",
      text: "Após a exclusão não será possível reverter!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, delete!"
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('/api/categories?_id=' + _id)
        fetchCategories();
        swal.fire({
          title: "Deletado!",
          text: "Sua categoria foi deletada com sucesso.",
          icon: "success"
        });
      }
    });
  }

  function addProperty() {
    setProperties(prev => {
      return [...prev, { name: '', values: '' }]
    })
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties(prev => {
      const properties = [...prev]
      properties[index].name = newName;
      return properties
    })
  }
  function handlePropertyValuesChange(index, property, newValue) {
    setProperties(prev => {
      const properties = [...prev]
      properties[index].value = newValue;
      return properties
    })
  }

  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove
      })
    })
  }


  return (
    <Layout>
      <h1>Categoria</h1>
      <label>{editedCategory ? `Editar Categoria ${editedCategory.name}` : 'Nova Categoria'}</label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input type="text"
            placeholder={'Category Name'} value={name}
            onChange={ev => setName(ev.target.value)} />
          <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
            <option value="">Sem Categoria</option>
            {categories.length > 0 && categories.map(category => (
              <option value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Propriedades:</label>
          <button onClick={addProperty} type="button" className="btn-default text-sm mb-2">Adicionar Nova Propriedade</button>
          {properties.length > 0 && properties.map((property, index) => (
            <div className="flex gap-1 mb-2">
              <input type="text" className="mb-0" value={property.name} onChange={ev => handlePropertyNameChange(index, property, ev.target.value)} placeholder="Nome da Propriedade (exemplo: cor)" />
              <input type="text" className="mb-0" value={property.value} onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)} placeholder="valor, separado por vírgula" />
              <button type={"button"} onClick={() => removeProperty(index)} className="btn-default">Remover</button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button type={"button"} onClick={() => {
              setEditedCategory(null); 
              setName('');
              setParentCategory('');
              setProperties([])
            }} 
            className="btn-default">Cancelar</button>
          )}
          <button type="submit" className=" btn-primary py-1">Salvar</button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Nome da Categoria</td>
              <td>SubCategoria</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 && categories.map(category => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button onClick={() => editCategory(category)} className="btn-primary mr-1">Editar</button>
                  <button onClick={() => deleteCategory(category)} className="btn-primary">Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </Layout>
  )
}
export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
))
