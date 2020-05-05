import { history } from './../../index';
import { User, UserFormValues } from './../models/user';
import { observable, computed, action, runInAction } from 'mobx';
import agent from 'app/api/agent';
import { RootStore } from './rootStore';

export default class UserStore {
  rootStore: RootStore;

  @observable user: User | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @action login = async (values: UserFormValues) => {
    try {
      const user = await agent.UserService.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: UserFormValues) => {
    try {
      const user = await agent.UserService.register(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action getUser = async () => {
    try {
      const user = await agent.UserService.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
  };
}
