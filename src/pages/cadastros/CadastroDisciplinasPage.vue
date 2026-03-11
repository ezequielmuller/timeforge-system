<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-dark" style="letter-spacing: -0.5px">
          Cadastro de Disciplinas
        </div>
      </div>
    </div>

    <q-card flat bordered class="q-mb-lg" style="border-radius: 16px">
      <q-card-section>
        <div class="text-subtitle2 text-grey-7 q-mb-md">Nova Disciplina</div>
        <div class="row q-gutter-md items-start">
          <div class="col-12 col-md-5">
            <q-input
              v-model="form.nome"
              label="Nome da disciplina"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              :rules="[(val) => !!val || 'Informe o nome']"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="menu_book" color="primary" size="18px" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <q-input
              v-model="form.codigo"
              label="Código (ex: MAT01)"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              :rules="[(val) => !!val || 'Informe o código']"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="tag" color="primary" size="18px" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-auto flex items-center">
            <q-toggle v-model="form.requerLaboratorio" label="Requer laboratório" color="primary" />
          </div>

          <div class="col-12 col-md-auto flex items-start">
            <q-btn
              label="Salvar"
              color="primary"
              unelevated
              icon="save"
              style="border-radius: 10px; height: 40px"
              @click="salvar"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela -->
    <q-card flat bordered style="border-radius: 16px">
      <q-card-section class="q-pb-none">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-subtitle2 text-grey-7">Disciplinas cadastradas</div>
          <q-input
            v-model="filtro"
            placeholder="Buscar..."
            outlined
            dense
            color="primary"
            bg-color="grey-1"
            style="width: 220px"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="search" size="18px" color="grey-5" />
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-table
        :rows="disciplinasFiltradas"
        :columns="colunas"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 8 }"
        no-data-label="Nenhuma disciplina cadastrada"
      >
        <!-- Nome com ícone -->
        <template v-slot:body-cell-nome="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm no-wrap">
              <q-avatar size="32px" color="secondary" text-color="white" font-size="11px">
                {{ props.row.codigo }}
              </q-avatar>
              <span class="text-weight-medium">{{ props.row.nome }}</span>
            </div>
          </q-td>
        </template>

        <!-- Badge laboratório -->
        <template v-slot:body-cell-requerLaboratorio="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.requerLaboratorio ? 'teal' : 'grey-4'"
              :text-color="props.row.requerLaboratorio ? 'white' : 'grey-7'"
              :label="props.row.requerLaboratorio ? 'Sim' : 'Não'"
              style="border-radius: 6px; padding: 4px 10px"
            />
          </q-td>
        </template>

        <!-- Ações -->
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props" class="q-gutter-xs">
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="primary"
              size="sm"
              @click="editar(props.row)"
            >
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              icon="delete_outline"
              color="negative"
              size="sm"
              @click="confirmarExclusao(props.row)"
            >
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>

  <!-- Dialog editar -->
  <q-dialog v-model="dialogEditar" persistent>
    <q-card style="min-width: 400px; border-radius: 16px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Editar Disciplina</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-input
          v-model="disciplinaEditando.nome"
          label="Nome da disciplina"
          outlined
          dense
          color="primary"
          bg-color="grey-1"
          autofocus
        >
          <template v-slot:prepend>
            <q-icon name="menu_book" color="primary" size="18px" />
          </template>
        </q-input>
        <q-input
          v-model="disciplinaEditando.codigo"
          label="Código"
          outlined
          dense
          color="primary"
          bg-color="grey-1"
        >
          <template v-slot:prepend>
            <q-icon name="tag" color="primary" size="18px" />
          </template>
        </q-input>
        <q-toggle
          v-model="disciplinaEditando.requerLaboratorio"
          label="Requer laboratório"
          color="primary"
        />
      </q-card-section>
      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
        <q-btn
          label="Salvar"
          color="primary"
          unelevated
          style="border-radius: 10px"
          icon="save"
          @click="salvarEdicao"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dialog excluir -->
  <q-dialog v-model="dialogExcluir" persistent>
    <q-card style="min-width: 320px; border-radius: 16px">
      <q-card-section class="row items-center q-gutter-sm">
        <q-icon name="warning_amber" color="negative" size="28px" />
        <div class="text-h6 text-weight-bold">Excluir disciplina?</div>
      </q-card-section>
      <q-card-section class="q-pt-none text-grey-7">
        Deseja excluir <strong>{{ disciplinaExcluindo?.nome }}</strong
        >? Esta ação não pode ser desfeita.
      </q-card-section>
      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
        <q-btn
          label="Excluir"
          color="negative"
          unelevated
          style="border-radius: 10px"
          @click="excluir"
          icon="delete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const form = ref({ nome: '', codigo: '', requerLaboratorio: false })
const filtro = ref('')
const dialogEditar = ref(false)
const dialogExcluir = ref(false)
const disciplinaEditando = ref({ id: null, nome: '', codigo: '', requerLaboratorio: false })
const disciplinaExcluindo = ref(null)

const disciplinas = ref([
  { id: 1, nome: 'Matemática', codigo: 'MAT01', requerLaboratorio: false },
  { id: 2, nome: 'Química', codigo: 'QUI01', requerLaboratorio: true },
  { id: 3, nome: 'Física', codigo: 'FIS01', requerLaboratorio: true },
])

const colunas = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'center', sortable: true },
  { name: 'requerLaboratorio', label: 'Laboratório', field: 'requerLaboratorio', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const disciplinasFiltradas = computed(() => {
  if (!filtro.value) return disciplinas.value
  const q = filtro.value.toLowerCase()
  return disciplinas.value.filter(
    (d) => d.nome.toLowerCase().includes(q) || d.codigo.toLowerCase().includes(q),
  )
})

function salvar() {
  if (!form.value.nome.trim() || !form.value.codigo.trim()) return
  disciplinas.value.push({ id: Date.now(), ...form.value })
  form.value = { nome: '', codigo: '', requerLaboratorio: false }
  $q.notify({ type: 'positive', message: 'Disciplina salva com sucesso!', position: 'top' })
}

function editar(disciplina) {
  disciplinaEditando.value = { ...disciplina }
  dialogEditar.value = true
}

function salvarEdicao() {
  const idx = disciplinas.value.findIndex((d) => d.id === disciplinaEditando.value.id)
  if (idx !== -1) disciplinas.value[idx] = { ...disciplinaEditando.value }
  dialogEditar.value = false
  $q.notify({ type: 'positive', message: 'Disciplina atualizada!', position: 'top' })
}

function confirmarExclusao(disciplina) {
  disciplinaExcluindo.value = disciplina
  dialogExcluir.value = true
}

function excluir() {
  disciplinas.value = disciplinas.value.filter((d) => d.id !== disciplinaExcluindo.value.id)
  dialogExcluir.value = false
  $q.notify({ type: 'negative', message: 'Disciplina excluída.', position: 'top' })
}
</script>
