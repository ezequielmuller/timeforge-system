<template>
  <q-page padding>
    <!-- Cabeçalho -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold text-dark" style="letter-spacing: -0.5px">
          Cadastro de Turmas
        </div>
        <div class="text-caption text-grey-6">Gerencie as turmas cadastradas no sistema</div>
      </div>
    </div>

    <!-- Card formulário -->
    <q-card flat bordered class="q-mb-lg" style="border-radius: 16px">
      <q-card-section>
        <div class="text-subtitle2 text-grey-7 q-mb-md">Nova Turma</div>
        <div class="row q-gutter-md items-start">
          <div class="col-12 col-md-5">
            <q-input
              v-model="form.nome"
              label="Nome da turma"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              :rules="[(val) => !!val || 'Informe o nome']"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="groups" color="primary" size="18px" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <q-input
              v-model.number="form.capacidade"
              label="Capacidade"
              type="number"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              :rules="[
                (val) => !!val || 'Informe a capacidade',
                (val) => val > 0 || 'Deve ser maior que zero',
              ]"
              min="1"
            >
              <template v-slot:prepend>
                <q-icon name="person_add" color="primary" size="18px" />
              </template>
            </q-input>
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
          <div class="text-subtitle2 text-grey-7">Turmas cadastradas</div>
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
        :rows="turmasFiltradas"
        :columns="colunas"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 8 }"
        no-data-label="Nenhuma turma cadastrada"
      >
        <!-- Nome com avatar -->
        <template v-slot:body-cell-nome="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm no-wrap">
              <q-avatar size="32px" color="primary" text-color="white" font-size="12px">
                {{ iniciais(props.row.nome) }}
              </q-avatar>
              <span class="text-weight-medium">{{ props.row.nome }}</span>
            </div>
          </q-td>
        </template>

        <!-- Capacidade com badge -->
        <template v-slot:body-cell-capacidade="props">
          <q-td :props="props">
            <q-badge
              color="secondary"
              text-color="white"
              style="border-radius: 6px; padding: 4px 10px; font-size: 13px"
            >
              <q-icon name="person" size="12px" class="q-mr-xs" />
              {{ props.row.capacidade }} alunos
            </q-badge>
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

    <!-- Dialog editar -->
    <q-dialog v-model="dialogEditar" persistent>
      <q-card style="min-width: 400px; border-radius: 16px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Editar Turma</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-gutter-md">
          <q-input
            v-model="turmaEditando.nome"
            label="Nome da turma"
            outlined
            dense
            color="primary"
            bg-color="grey-1"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="groups" color="primary" size="18px" />
            </template>
          </q-input>
          <q-input
            v-model.number="turmaEditando.capacidade"
            label="Capacidade"
            type="number"
            outlined
            dense
            color="primary"
            bg-color="grey-1"
            min="1"
          >
            <template v-slot:prepend>
              <q-icon name="person_add" color="primary" size="18px" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn
            label="Salvar"
            color="primary"
            unelevated
            style="border-radius: 8px"
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
          <div class="text-h6 text-weight-bold">Excluir turma?</div>
        </q-card-section>
        <q-card-section class="q-pt-none text-grey-7">
          Deseja excluir <strong>{{ turmaExcluindo?.nome }}</strong
          >? Esta ação não pode ser desfeita.
        </q-card-section>
        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" color="grey-6" v-close-popup />
          <q-btn
            label="Excluir"
            color="negative"
            unelevated
            style="border-radius: 8px"
            @click="excluir"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const form = ref({ nome: '', capacidade: null })
const filtro = ref('')
const dialogEditar = ref(false)
const dialogExcluir = ref(false)
const turmaEditando = ref({ id: null, nome: '', capacidade: null })
const turmaExcluindo = ref(null)

const turmas = ref([
  { id: 1, nome: '1º Ano A', capacidade: 35 },
  { id: 2, nome: '2º Ano B', capacidade: 30 },
  { id: 3, nome: '3º Ano C', capacidade: 28 },
])

const colunas = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'capacidade', label: 'Capacidade', field: 'capacidade', align: 'center', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const turmasFiltradas = computed(() => {
  if (!filtro.value) return turmas.value
  return turmas.value.filter((t) => t.nome.toLowerCase().includes(filtro.value.toLowerCase()))
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
  if (!form.value.nome.trim() || !form.value.capacidade) return
  turmas.value.push({ id: Date.now(), ...form.value })
  form.value = { nome: '', capacidade: null }
  $q.notify({ type: 'positive', message: 'Turma salva com sucesso!', position: 'top' })
}

function editar(turma) {
  turmaEditando.value = { ...turma }
  dialogEditar.value = true
}

function salvarEdicao() {
  const idx = turmas.value.findIndex((t) => t.id === turmaEditando.value.id)
  if (idx !== -1) turmas.value[idx] = { ...turmaEditando.value }
  dialogEditar.value = false
  $q.notify({ type: 'positive', message: 'Turma atualizada!', position: 'top' })
}

function confirmarExclusao(turma) {
  turmaExcluindo.value = turma
  dialogExcluir.value = true
}

function excluir() {
  turmas.value = turmas.value.filter((t) => t.id !== turmaExcluindo.value.id)
  dialogExcluir.value = false
  $q.notify({ type: 'negative', message: 'Turma excluída.', position: 'top' })
}
</script>
