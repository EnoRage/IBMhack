using System;
using System.Collections.ObjectModel;
using System.Windows.Input;
using UnblockHackNET.BL.DB;

namespace UnblockHackNET.BL.ViewModels.VotingHistory
{
    public class VotingHistoryViewModel : BaseViewModel
    {
        public VotingHistoryViewModel()
        {
            _investor = new Investor();
            LoadVotes();
        }
        private Investor _investor;

        public double Balance
        {
            get => Get(0.0);
            set => Set(value);
        }

        public string BalanceText
        {
            get => Get("");
            set => Set(value);
        }

        public bool IsRefreshing
        {
            get => Get(false);
            set => Set(value);
        }

        public ObservableCollection<Organisation> RefreshChartItemSource
        {
            get => Get(new ObservableCollection<Organisation>());
            set => Set(value);
        }

        public ICommand RefreshCommand => MakeCommand(() =>
        {
            RefreshChartItemSource = new ObservableCollection<Organisation>();
            LoadVotes();
        });

        private async void LoadVotes()
        {
            IsRefreshing = true;
            RefreshChartItemSource = await DataBaseService.GetAllOrganisationCompose();
            _investor = await DataBaseService.GetInvestor("1111");
            Balance = _investor.Balance;
            BalanceText = $"Мой баланс: {Balance}";
            OnPropertyChanged(nameof(RefreshChartItemSource));
            IsRefreshing = false;
        }
    }
}
