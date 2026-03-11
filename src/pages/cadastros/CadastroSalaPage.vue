<template>
  <q-page padding>
    <!-- Cabeçalho -->
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-dark" style="letter-spacing: -0.5px">
          Cadastro de Salas
        </div>
      </div>
    </div>

    <!-- Card formulário -->
    <q-card flat bordered class="q-mb-lg" style="border-radius: 16px">
      <q-card-section>
        <div class="text-subtitle2 text-grey-7 q-mb-md">Nova Sala</div>
        <div class="row q-gutter-md items-start">
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.nome"
              label="Nome da sala"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              :rules="[(val) => !!val || 'Informe o nome']"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="door_front" color="primary" size="18px" />
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

          <div class="col-12 col-md-3">
            <q-select
              v-model="form.tipo"
              :options="tiposOpcoes"
              label="Tipo"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              emit-value
              map-options
              :rules="[(val) => !!val || 'Selecione o tipo']"
            >
              <template v-slot:prepend>
                <q-icon name="category" color="primary" size="18px" />
              </template>
            </q-select>
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
          <div class="text-subtitle2 text-grey-7">Salas cadastradas</div>
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
        :rows="salasFiltradas"
        :columns="colunas"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 8 }"
        no-data-label="Nenhuma sala cadastrada"
      >
        <!-- Nome com avatar -->
        <template v-slot:body-cell-nome="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-sm no-wrap">
              <q-avatar
                size="32px"
                :color="props.row.tipo === 'laboratorio' ? 'teal' : 'secondary'"
                text-color="white"
              >
                <q-icon
                  :name="props.row.tipo === 'laboratorio' ? 'science' : 'door_front'"
                  size="16px"
                />
              </q-avatar>
              <span class="text-weight-medium">{{ props.row.nome }}</span>
            </div>
          </q-td>
        </template>

        <!-- Capacidade badge -->
        <template v-slot:body-cell-capacidade="props">
          <q-td :props="props">
            <q-badge
              color="secondary"
              text-color="white"
              style="border-radius: 6px; padding: 4px 10px; font-size: 13px"
            >
              <q-icon name="person" size="12px" class="q-mr-xs" />
              {{ props.row.capacidade }} lugares
            </q-badge>
          </q-td>
        </template>

        <!-- Tipo badge -->
        <template v-slot:body-cell-tipo="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.tipo === 'laboratorio' ? 'teal' : 'blue-grey-4'"
              text-color="white"
              style="border-radius: 6px; padding: 4px 12px"
            >
              <q-icon
                :name="props.row.tipo === 'laboratorio' ? 'science' : 'weekend'"
                size="12px"
                class="q-mr-xs"
              />
              {{ props.row.tipo === 'laboratorio' ? 'Laboratório' : 'Comum' }}
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
  </q-page>

  <!-- Dialog editar -->
  <q-dialog v-model="dialogEditar" persistent>
    <q-card style="min-width: 420px; border-radius: 16px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 text-weight-bold">Editar Sala</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-input
          v-model="salaEditando.nome"
          label="Nome da sala"
          outlined
          dense
          color="primary"
          bg-color="grey-1"
          autofocus
        >
          <template v-slot:prepend>
            <q-icon name="door_front" color="primary" size="18px" />
          </template>
        </q-input>
        <q-input
          v-model.number="salaEditando.capacidade"
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
        <q-select
          v-model="salaEditando.tipo"
          :options="tiposOpcoes"
          label="Tipo"
          outlined
          dense
          color="primary"
          bg-color="grey-1"
          emit-value
          map-options
        >
          <template v-slot:prepend>
            <q-icon name="category" color="primary" size="18px" />
          </template>
        </q-select>
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
        <div class="text-h6 text-weight-bold">Excluir sala?</div>
      </q-card-section>
      <q-card-section class="q-pt-none text-grey-7">
        Deseja excluir <strong>{{ salaExcluindo?.nome }}</strong
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

const tiposOpcoes = [
  { label: 'Comum', value: 'comum' },
  { label: 'Laboratório', value: 'laboratorio' },
]

const form = ref({ nome: '', capacidade: null, tipo: null })
const filtro = ref('')
const dialogEditar = ref(false)
const dialogExcluir = ref(false)
const salaEditando = ref({ id: null, nome: '', capacidade: null, tipo: null })
const salaExcluindo = ref(null)

const salas = ref([
  { id: 1, nome: 'Sala 01', capacidade: 35, tipo: 'comum' },
  { id: 2, nome: 'Lab. Informática', capacidade: 20, tipo: 'laboratorio' },
  { id: 3, nome: 'Sala 02', capacidade: 30, tipo: 'comum' },
  { id: 4, nome: 'Lab. Química', capacidade: 18, tipo: 'laboratorio' },
])

const colunas = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'capacidade', label: 'Capacidade', field: 'capacidade', align: 'center', sortable: true },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'center', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

const salasFiltradas = computed(() => {
  if (!filtro.value) return salas.value
  const q = filtro.value.toLowerCase()
  return salas.value.filter(
    (s) => s.nome.toLowerCase().includes(q) || s.tipo.toLowerCase().includes(q),
  )
})

function salvar() {
  if (!form.value.nome.trim() || !form.value.capacidade || !form.value.tipo) return
  salas.value.push({ id: Date.now(), ...form.value })
  form.value = { nome: '', capacidade: null, tipo: null }
  $q.notify({ type: 'positive', message: 'Sala salva com sucesso!', position: 'top' })
}

function editar(sala) {
  salaEditando.value = { ...sala }
  dialogEditar.value = true
}

function salvarEdicao() {
  const idx = salas.value.findIndex((s) => s.id === salaEditando.value.id)
  if (idx !== -1) salas.value[idx] = { ...salaEditando.value }
  dialogEditar.value = false
  $q.notify({ type: 'positive', message: 'Sala atualizada!', position: 'top' })
}

function confirmarExclusao(sala) {
  salaExcluindo.value = sala
  dialogExcluir.value = true
}

function excluir() {
  salas.value = salas.value.filter((s) => s.id !== salaExcluindo.value.id)
  dialogExcluir.value = false
  $q.notify({ type: 'negative', message: 'Sala excluída.', position: 'top' })
}
</script>
