<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated class="header-gradient text-white">
      <q-toolbar>
        <!-- BOTÃO HAMBURGER só no mobile -->
        <q-btn flat dense round icon="menu" color="white" class="lt-md" @click="drawer = !drawer" />

        <q-img src="/public/logo.png" style="width: 40px; border-radius: 30px"></q-img>
        <q-toolbar-title class="text-weight-bold text-h6 q-pl-sm">
          <span class="text-white">Time</span>Forge
        </q-toolbar-title>

        <q-space />

        <q-btn flat round dense icon="notifications" color="white">
          <q-badge color="red" floating>3</q-badge>
        </q-btn>
        <q-btn flat round dense class="q-ml-sm">
          <q-avatar size="32px" color="white" text-color="orange-8" font-size="14px"> A </q-avatar>
        </q-btn>
        <q-separator vertical color="white" class="q-ma-md" />
        <q-btn flat round dense icon="logout" color="white">
          <q-tooltip>Sair do sistema</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer
      v-model="drawer"
      show-if-above
      bordered
      :mini="miniState"
      :width="260"
      :mini-width="68"
      class="drawer-modern"
      :breakpoint="768"
    >
      <!-- LOGO ÁREA no drawer (só quando expandido) -->
      <div v-if="!miniState" class="drawer-logo q-px-md q-pt-lg q-pb-md">
        <div class="text-caption text-grey-7 text-uppercase text-weight-bold letter-spacing">
          Menu Principal
        </div>
      </div>

      <q-list padding class="q-px-sm">
        <!-- DASHBOARD -->
        <q-item
          clickable
          v-ripple
          @click="handleNavigation('/consulta-horarios')"
          :active="$route.path === '/consulta-horarios'"
          active-class="item-active"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" size="20px" />
          </q-item-section>
          <q-item-section v-if="!miniState" class="text-weight-medium"> Dashboard </q-item-section>
          <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
            Dashboard
          </q-tooltip>
        </q-item>

        <!-- SEPARATOR COM LABEL -->
        <div v-if="!miniState" class="q-px-md q-pt-md q-pb-xs">
          <div class="text-caption text-grey-7 text-uppercase text-weight-bold letter-spacing">
            Gestão
          </div>
        </div>
        <q-separator v-else class="q-my-sm q-mx-md" />

        <!-- CADASTROS EXPANDÍVEL -->
        <q-expansion-item
          v-if="!miniState"
          v-model="cadastrosOpen"
          icon="folder_open"
          label="Cadastros"
          expand-separator
          header-class="menu-item text-weight-medium"
          expand-icon-class="text-grey-5"
        >
          <q-item
            clickable
            v-ripple
            @click="handleNavigation('/cadastros/professores')"
            :active="$route.path === '/cadastros/professores'"
            active-class="item-active"
            class="submenu-item"
          >
            <q-item-section avatar>
              <q-icon name="person_outline" size="18px" />
            </q-item-section>
            <q-item-section class="text-body2"> Professores </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="handleNavigation('/cadastros/disciplinas')"
            :active="$route.path === '/cadastros/disciplinas'"
            active-class="item-active"
            class="submenu-item"
          >
            <q-item-section avatar>
              <q-icon name="menu_book" size="18px" />
            </q-item-section>
            <q-item-section class="text-body2"> Disciplinas </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="handleNavigation('/cadastros/turmas')"
            :active="$route.path === '/cadastros/turmas'"
            active-class="item-active"
            class="submenu-item"
          >
            <q-item-section avatar>
              <q-icon name="groups" size="18px" />
            </q-item-section>
            <q-item-section class="text-body2"> Turmas </q-item-section>
          </q-item>
        </q-expansion-item>

        <!-- ÍCONE CADASTRO MINI -->
        <q-item v-if="miniState" clickable v-ripple @click="expandOnly" class="menu-item">
          <q-item-section avatar>
            <q-icon name="folder_open" size="20px" />
          </q-item-section>
          <q-tooltip anchor="center right" self="center left" :offset="[10, 0]">
            Cadastros
          </q-tooltip>
        </q-item>

        <!-- HORÁRIOS -->
        <q-item
          clickable
          v-ripple
          @click="handleNavigation('/horarios')"
          :active="$route.path === '/horarios'"
          active-class="item-active"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="calendar_month" size="20px" />
          </q-item-section>
          <q-item-section v-if="!miniState" class="text-weight-medium"> Horários </q-item-section>
          <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
            Horários
          </q-tooltip>
        </q-item>

        <!-- RELATÓRIOS -->
        <q-item
          clickable
          v-ripple
          @click="handleNavigation('/relatorios')"
          :active="$route.path === '/relatorios'"
          active-class="item-active"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="bar_chart" size="20px" />
          </q-item-section>
          <q-item-section v-if="!miniState" class="text-weight-medium"> Relatórios </q-item-section>
          <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
            Relatórios
          </q-tooltip>
        </q-item>

        <!-- SEPARATOR INFERIOR -->
        <div v-if="!miniState" class="q-px-md q-pt-md q-pb-xs">
          <div class="text-caption text-grey-7 text-uppercase text-weight-bold letter-spacing">
            Sistema
          </div>
        </div>
        <q-separator v-else class="q-my-sm q-mx-md" />

        <!-- CONFIGURAÇÕES -->
        <q-item
          clickable
          v-ripple
          @click="handleNavigation('/admin/configuracoes')"
          :active="$route.path === '/admin/configuracoes'"
          active-class="item-active"
          class="menu-item"
        >
          <q-item-section avatar>
            <q-icon name="settings" size="20px" />
          </q-item-section>
          <q-item-section v-if="!miniState" class="text-weight-medium">
            Configurações
          </q-item-section>
          <q-tooltip v-if="miniState" anchor="center right" self="center left" :offset="[10, 0]">
            Configurações
          </q-tooltip>
        </q-item>
      </q-list>

      <!-- BOTÃO TOGGLE NA BORDA DO DRAWER (só desktop) -->
      <q-btn
        round
        unelevated
        size="sm"
        :icon="miniState ? 'chevron_right' : 'chevron_left'"
        class="toggle-btn gt-sm"
        @click="toggleMini"
      />
    </q-drawer>

    <!-- CONTEÚDO -->
    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(true)
const miniState = ref(false)
const cadastrosOpen = ref(false)
const router = useRouter()

function toggleMini() {
  miniState.value = !miniState.value
}

function handleNavigation(path) {
  if (miniState.value) {
    miniState.value = false
    return
  }
  router.push(path)
}

function expandOnly() {
  miniState.value = false
}
</script>

<style scoped>
.header-gradient {
  background: #ff6b00 0%;
  box-shadow: 0 2px 12px rgba(255, 107, 0, 0.3);
}

.drawer-modern {
  background: #ffffff;
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid #f0f0f0 !important;
}

.letter-spacing {
  letter-spacing: 0.08em;
  font-size: 10px;
}

.drawer-logo {
  border-bottom: 1px solid #f5f5f5;
}

/* Item de menu */
.menu-item {
  border-radius: 10px;
  margin-bottom: 2px;
  min-height: 44px;
  transition:
    background 0.2s ease,
    color 0.2s ease;
  color: #4a4a4a;
}

.menu-item:hover {
  background-color: #fff4ec;
  color: #ff6b00;
}

/* Submenu */
.submenu-item {
  border-radius: 8px;
  margin-left: 8px;
  margin-bottom: 2px;
  min-height: 40px;
  color: #5a5a5a;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.submenu-item:hover {
  background-color: #fff4ec;
  color: #ff6b00;
}

/* Ativo */
.item-active {
  background: linear-gradient(135deg, #ff6b00, #ff8c42) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(255, 107, 0, 0.25);
}

.item-active .q-icon {
  color: #ffffff !important;
}

/* BOTÃO TOGGLE NA BORDA */
.toggle-btn {
  position: absolute;
  top: 54px; /* Abaixo do header */
  right: -12px; /* Metade do botão fora do drawer */

  background: #ffffff;
  color: #ff6b00;
  border: 2px solid #f0e8e0;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.12);
  z-index: 10;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.toggle-btn:hover {
  box-shadow: 2px 2px 14px rgba(255, 107, 0, 0.3);
  transform: scale(1);
}
</style>
