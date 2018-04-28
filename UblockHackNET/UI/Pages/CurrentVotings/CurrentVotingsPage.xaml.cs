using System;
using System.Collections.Generic;

using Xamarin.Forms;

namespace UnblockHackNET.UI.Pages.CurrentVotings
{
    public partial class CurrentVotingsPage : BasePage
    {
        public CurrentVotingsPage()
        {
            InitializeComponent();
        }

        public void Handle_ItemTapped(object sender, ItemTappedEventArgs e)
        {
            var t = sender as ListView;
            if (t != null)
            {
                t.SelectedItem = null;
            }
        }
    }
}
