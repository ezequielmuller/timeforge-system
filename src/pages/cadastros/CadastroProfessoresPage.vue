<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-dark" style="letter-spacing: -0.5px">
          Cadastro de Professores
        </div>
      </div>
    </div>

    <q-card flat bordered class="q-mb-lg" style="border-radius: 16px">
      <q-card-section>
        <div class="text-subtitle2 text-grey-7 q-mb-md">Novo Professor</div>
        <div class="row q-gutter-md items-start">
          <div class="col-12 col-md-6">
            <q-input
              v-model="nome"
              label="Nome completo"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              :rules="[(val) => !!val || 'Informe o nome']"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="person_outline" color="primary" size="18px" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-auto">
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

    <q-card flat bordered style="border-radius: 16px">
      <q-card-section class="q-pb-none">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-subtitle2 text-grey-7">Professores cadastrados</div>
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
        :rows="professoresFiltrados"
        :columns="colunas"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 8 }"
        no-data-label="Nenhum professor cadastrado"
      >
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

        <template v-slot:body-cell-nome="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm no-wrap">
              <q-avatar size="32px" color="primary" text-color="white" font-size="13px">
                {{ iniciais(props.row.nome) }}
              </q-avatar>
              <span class="text-weight-medium">{{ props.row.nome }}</span>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>

  <!-- Dialog editar -->
  <q-dialog v-model="dialogEditar" persistent>
    <q-card style="min-width: 360px; border-radius: 16px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Editar Professor</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="professorEditando.nome"
          label="Nome completo"
          outlined
          dense
          color="primary"
          bg-color="grey-1"
          autofocus
        >
          <template v-slot:prepend>
            <q-icon name="person_outline" color="primary" size="18px" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
        <q-btn
          label="Salvar"
          color="primary"
          unelevated
          style="border-radius: 10px"
          @click="salvarEdicao"
          icon="save"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Dialog excluir -->
  <q-dialog v-model="dialogExcluir" persistent>
    <q-card style="min-width: 320px; border-radius: 16px">
      <q-card-section class="row items-center q-gutter-sm">
        <q-icon name="warning_amber" color="negative" size="28px" />
        <div class="text-h6 text-weight-bold">Excluir professor?</div>
      </q-card-section>
      <q-card-section class="q-pt-none text-grey-7">
        Deseja excluir <strong>{{ professorExcluindo?.nome }}</strong
        >? Esta ação não pode ser desfeita.
      </q-card-section>
      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
        <q-btn
          label="Excluir"
          color="negative"
          unelevated
          style="border-radius: 10px"
          icon="delete"
          @click="excluir"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const nome = ref('')
const filtro = ref('')
const dialogEditar = ref(false)
const dialogExcluir = ref(false)
const professorEditando = ref({ id: null, nome: '' })
const professorExcluindo = ref(null)

const professores = ref([
  { id: 1, nome: 'Ana Paula Silva' },
  { id: 2, nome: 'Carlos Eduardo Souza' },
  { id: 3, nome: 'Mariana Costa' },
])

const colunas = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const professoresFiltrados = computed(() => {
  if (!filtro.value) return professores.value
  return professores.value.filter((p) => p.nome.toLowerCase().includes(filtro.value.toLowerCase()))
})

function iniciais(nomeCompleto) {
  return nomeCompleto
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function salvar() {
  if (!nome.value.trim()) return
  professores.value.push({ id: Date.now(), nome: nome.value.trim() })
  nome.value = ''
  $q.notify({
    type: 'positive',
    message: 'Professor salvo com sucesso!',
    position: 'top',
  })
}

function editar(professor) {
  professorEditando.value = { ...professor }
  dialogEditar.value = true
}

function salvarEdicao() {
  const idx = professores.value.findIndex((p) => p.id === professorEditando.value.id)
  if (idx !== -1) professores.value[idx] = { ...professorEditando.value }
  dialogEditar.value = false
  $q.notify({
    type: 'positive',
    message: 'Professor atualizado!',
    position: 'top',
  })
}

function confirmarExclusao(professor) {
  professorExcluindo.value = professor
  dialogExcluir.value = true
}

function excluir() {
  professores.value = professores.value.filter((p) => p.id !== professorExcluindo.value.id)
  dialogExcluir.value = false
  $q.notify({
    type: 'negative',
    message: 'Professor excluído.',
    position: 'top',
  })
}
</script>
