<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold text-dark" style="letter-spacing: -0.5px">
          Cadastro de Slots de Horário
        </div>
      </div>
    </div>

    <q-card flat bordered class="q-mb-lg" style="border-radius: 16px">
      <q-card-section>
        <div class="text-subtitle2 text-grey-7 q-mb-md">Novo Slot</div>
        <div class="row q-gutter-md items-start">
          <div class="col-12 col-md-3">
            <q-select
              v-model="form.diaSemana"
              :options="diasSemanaOpcoes"
              label="Dia da semana"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              emit-value
              map-options
              :rules="[(val) => !!val || 'Selecione o dia']"
            >
              <template v-slot:prepend>
                <q-icon name="calendar_today" color="primary" size="18px" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-2">
            <q-input
              v-model="form.horaInicio"
              label="Hora início"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              mask="##:##"
              placeholder="08:00"
              :rules="[
                (val) => !!val || 'Informe a hora de início',
                (val) => validarHora(val) || 'Hora inválida',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="schedule" color="primary" size="18px" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-2">
            <q-input
              v-model="form.horaFim"
              label="Hora fim"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              mask="##:##"
              placeholder="09:00"
              :rules="[
                (val) => !!val || 'Informe a hora de fim',
                (val) => validarHora(val) || 'Hora inválida',
                (val) => validarIntervalo(form.horaInicio, val) || 'Deve ser após a hora de início',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="schedule" color="primary" size="18px" />
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

    <q-card flat bordered style="border-radius: 16px">
      <q-card-section class="q-pb-none">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-subtitle2 text-grey-7">Slots cadastrados</div>
          <div class="row q-gutter-sm items-center">
            <!-- Filtro por dia -->
            <q-select
              v-model="filtroDia"
              :options="[{ label: 'Todos os dias', value: null }, ...diasSemanaOpcoes]"
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              emit-value
              map-options
              style="width: 180px"
            />
            <q-input
              v-model="filtro"
              placeholder="Buscar..."
              outlined
              dense
              color="primary"
              bg-color="grey-1"
              style="width: 180px"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" size="18px" color="grey-5" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <q-table
        :rows="slotsFiltrados"
        :columns="colunas"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10, sortBy: 'diaSemana' }"
        no-data-label="Nenhum slot cadastrado"
      >
        <template v-slot:body-cell-diaSemana="props">
          <q-td :props="props">
            <q-badge
              :color="corDia(props.row.diaSemana)"
              text-color="white"
              style="border-radius: 6px; padding: 4px 12px; font-size: 12px"
            >
              {{ labelDia(props.row.diaSemana) }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-horaInicio="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs">
              <q-icon name="schedule" color="primary" size="16px" />
              <span class="text-weight-medium">{{ props.row.horaInicio }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-horaFim="props">
          <q-td :props="props">
            <div class="row items-center q-gutter-xs">
              <q-icon name="schedule" color="grey-5" size="16px" />
              <span class="text-weight-medium">{{ props.row.horaFim }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-duracao="props">
          <q-td :props="props">
            <q-badge
              color="orange-2"
              text-color="orange-9"
              style="border-radius: 6px; padding: 4px 10px"
            >
              <q-icon name="timelapse" size="12px" class="q-mr-xs" />
              {{ calcularDuracao(props.row.horaInicio, props.row.horaFim) }}
            </q-badge>
          </q-td>
        </template>

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
        <div class="text-h6 text-weight-bold">Editar Slot</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-gutter-md">
        <q-select
          v-model="slotEditando.diaSemana"
          :options="diasSemanaOpcoes"
          label="Dia da semana"
          outlined
          dense
          color="primary"
          bg-color="grey-1"
          emit-value
          map-options
        >
          <template v-slot:prepend>
            <q-icon name="calendar_today" color="primary" size="18px" />
          </template>
        </q-select>
        <q-input
          v-model="slotEditando.horaInicio"
          label="Hora início"
          outlined
          dense
          color="primary"
          bg-color="grey-1"
          mask="##:##"
        >
          <template v-slot:prepend>
            <q-icon name="schedule" color="primary" size="18px" />
          </template>
        </q-input>
        <q-input
          v-model="slotEditando.horaFim"
          label="Hora fim"
          outlined
          dense
          color="primary"
          bg-color="grey-1"
          mask="##:##"
        >
          <template v-slot:prepend>
            <q-icon name="schedule" color="primary" size="18px" />
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
        <div class="text-h6 text-weight-bold">Excluir slot?</div>
      </q-card-section>
      <q-card-section class="q-pt-none text-grey-7">
        Deseja excluir o slot de
        <strong>{{ labelDia(slotExcluindo?.diaSemana) }}</strong>
        das <strong>{{ slotExcluindo?.horaInicio }}</strong> às
        <strong>{{ slotExcluindo?.horaFim }}</strong
        >?
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

const diasSemanaOpcoes = [
  { label: 'Segunda-feira', value: 'MONDAY' },
  { label: 'Terça-feira', value: 'TUESDAY' },
  { label: 'Quarta-feira', value: 'WEDNESDAY' },
  { label: 'Quinta-feira', value: 'THURSDAY' },
  { label: 'Sexta-feira', value: 'FRIDAY' },
  { label: 'Sábado', value: 'SATURDAY' },
  { label: 'Domingo', value: 'SUNDAY' },
]

const coresDia = {
  MONDAY: 'blue-7',
  TUESDAY: 'teal-6',
  WEDNESDAY: 'purple-6',
  THURSDAY: 'orange-7',
  FRIDAY: 'pink-6',
  SATURDAY: 'cyan-7',
  SUNDAY: 'red-6',
}

function labelDia(value) {
  return diasSemanaOpcoes.find((d) => d.value === value)?.label ?? value
}

function corDia(value) {
  return coresDia[value] ?? 'grey-6'
}

function validarHora(val) {
  if (!val || val.length < 5) return false
  const [h, m] = val.split(':').map(Number)
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

function validarIntervalo(inicio, fim) {
  if (!inicio || !fim || inicio.length < 5 || fim.length < 5) return true
  return inicio < fim
}

function calcularDuracao(inicio, fim) {
  if (!inicio || !fim) return '-'
  const [h1, m1] = inicio.split(':').map(Number)
  const [h2, m2] = fim.split(':').map(Number)
  const total = h2 * 60 + m2 - (h1 * 60 + m1)
  if (total <= 0) return '-'
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0) return `${h}h`
  return `${m}min`
}

const form = ref({ diaSemana: null, horaInicio: '', horaFim: '' })
const filtro = ref('')
const filtroDia = ref(null)
const dialogEditar = ref(false)
const dialogExcluir = ref(false)
const slotEditando = ref({ id: null, diaSemana: null, horaInicio: '', horaFim: '' })
const slotExcluindo = ref(null)

const slots = ref([
  { id: 1, diaSemana: 'MONDAY', horaInicio: '07:30', horaFim: '08:20' },
  { id: 2, diaSemana: 'MONDAY', horaInicio: '08:20', horaFim: '09:10' },
  { id: 3, diaSemana: 'TUESDAY', horaInicio: '07:30', horaFim: '08:20' },
  { id: 4, diaSemana: 'WEDNESDAY', horaInicio: '13:00', horaFim: '13:50' },
  { id: 5, diaSemana: 'FRIDAY', horaInicio: '19:00', horaFim: '19:50' },
])

const ordemDias = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const slotsFiltrados = computed(() => {
  let lista = [...slots.value]
  if (filtroDia.value) lista = lista.filter((s) => s.diaSemana === filtroDia.value)
  if (filtro.value) {
    const q = filtro.value.toLowerCase()
    lista = lista.filter(
      (s) =>
        labelDia(s.diaSemana).toLowerCase().includes(q) ||
        s.horaInicio.includes(q) ||
        s.horaFim.includes(q),
    )
  }
  return lista.sort(
    (a, b) =>
      ordemDias.indexOf(a.diaSemana) - ordemDias.indexOf(b.diaSemana) ||
      a.horaInicio.localeCompare(b.horaInicio),
  )
})

const colunas = [
  { name: 'diaSemana', label: 'Dia da semana', field: 'diaSemana', align: 'left', sortable: true },
  { name: 'horaInicio', label: 'Início', field: 'horaInicio', align: 'center', sortable: true },
  { name: 'horaFim', label: 'Fim', field: 'horaFim', align: 'center', sortable: true },
  { name: 'duracao', label: 'Duração', field: 'duracao', align: 'center' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
]

function salvar() {
  const { diaSemana, horaInicio, horaFim } = form.value
  if (!diaSemana || !horaInicio || !horaFim) return
  if (!validarHora(horaInicio) || !validarHora(horaFim)) return
  if (!validarIntervalo(horaInicio, horaFim)) {
    $q.notify({
      type: 'warning',
      message: 'A hora de início deve ser anterior à hora de fim.',
      position: 'top',
    })
    return
  }
  slots.value.push({ id: Date.now(), ...form.value })
  form.value = { diaSemana: null, horaInicio: '', horaFim: '' }
  $q.notify({ type: 'positive', message: 'Slot salvo com sucesso!', position: 'top' })
}

function editar(slot) {
  slotEditando.value = { ...slot }
  dialogEditar.value = true
}

function salvarEdicao() {
  if (!validarIntervalo(slotEditando.value.horaInicio, slotEditando.value.horaFim)) {
    $q.notify({
      type: 'warning',
      message: 'A hora de início deve ser anterior à hora de fim.',
      position: 'top',
    })
    return
  }
  const idx = slots.value.findIndex((s) => s.id === slotEditando.value.id)
  if (idx !== -1) slots.value[idx] = { ...slotEditando.value }
  dialogEditar.value = false
  $q.notify({ type: 'positive', message: 'Slot atualizado!', position: 'top' })
}

function confirmarExclusao(slot) {
  slotExcluindo.value = slot
  dialogExcluir.value = true
}

function excluir() {
  slots.value = slots.value.filter((s) => s.id !== slotExcluindo.value.id)
  dialogExcluir.value = false
  $q.notify({ type: 'negative', message: 'Slot excluído.', position: 'top' })
}
</script>
