<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="row items-center justify-center q-gutter-xl" style="max-width: 900px">
      <!-- Logo -->
      <div class="flex flex-center">
        <q-img src="/public/logosfundo.png" style="width: 280px" />
      </div>

      <!-- Descrição -->
      <div class="col-12 col-md-5 text-center text-md-left">
        <div class="text-h4 text-weight-bold text-dark q-mb-sm" style="letter-spacing: -1px">
          Bem‑vindo ao <span class="text-primary">TimeForge</span>
        </div>

        <p class="text-body1 text-grey-7 q-mb-xl" style="line-height: 1.8">
          Gerencie horários, professores e disciplinas de forma simples, rápida e inteligente - tudo
          em um só lugar.
        </p>

        <q-btn
          label="Ver Horários"
          color="primary"
          unelevated
          size="lg"
          icon-right="arrow_forward"
          style="border-radius: 12px"
          @click="rota.push('/horarios')"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const rota = useRouter()
</script>
