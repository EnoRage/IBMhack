using System;
using System.Collections.ObjectModel;
using System.Windows.Input;
using UnblockHackNET.BL.DB;

namespace UnblockHackNET.BL.ViewModels.CurrentVotings
{
    public class CurrentVotingsViewModel : BaseViewModel
    {
        public bool IsRefreshing
        {
            get => Get(false);
            set => Set(value);
        }

        public ICommand RefreshCommand => MakeCommand(()=>
        {
            RefreshChartItemSource = new ObservableCollection<VotationProposal>();
            LoadVotes();

        });

        public ObservableCollection<VotationProposal> RefreshChartItemSource
        {
            get => Get(new ObservableCollection<VotationProposal>());
            set => Set(value);
        }

        public CurrentVotingsViewModel()
        {
            LoadVotes();
        }

        private async void LoadVotes()
        {
            IsRefreshing = true;
            RefreshChartItemSource = await DataBaseService.GetAllVotesCompose();
            OnPropertyChanged(nameof(RefreshChartItemSource));
            IsRefreshing = false;
        }
    }
}
