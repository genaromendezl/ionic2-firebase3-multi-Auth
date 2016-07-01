import {Component}   from '@angular/core'
import {HomePage}    from '../home/home';
import {ContactPage} from '../contact/contact';
import {NewsPage}    from '../news/news';
import {ChatPage}    from '../chat/chat';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;
  private tab4Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = ContactPage;
    this.tab3Root = NewsPage;
    this.tab4Root = ChatPage;
  }
}
