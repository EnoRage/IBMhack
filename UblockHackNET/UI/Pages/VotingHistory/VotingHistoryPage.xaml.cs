using System;
using System.Collections.Generic;

using Xamarin.Forms;

namespace UnblockHackNET.UI.Pages.VotingHistory
{
    public partial class VotingHistoryPage : BasePage
    {
        public VotingHistoryPage()
        {
            InitializeComponent();
        }

        void Handle_ItemTapped(object sender, Xamarin.Forms.ItemTappedEventArgs e)
        {
            if (sender is ListView)
            {
                var t = sender as ListView;
                if (t != null)
                {
                    t.SelectedItem = null;
                }
            }
        }
    }
}
